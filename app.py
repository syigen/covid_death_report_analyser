import csv
import datetime
import enum
import json
import os
import subprocess
import tempfile
import zipfile
from distutils.dir_util import copy_tree
from typing import List
from uuid import uuid4

import boto3
from flask import Flask, request, render_template, send_from_directory, redirect, url_for, jsonify, flash
from flask_assets import Environment
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.hybrid import hybrid_property
from webassets import Bundle
from werkzeug.utils import secure_filename

# Let's use Amazon S3
from app_helper import generate_summery

ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY", "")
SECRET_KEY = os.environ.get("AWS_SECRET_KEY", "")
aws_client = boto3.resource('s3', aws_access_key_id=ACCESS_KEY,
                            aws_secret_access_key=SECRET_KEY)

UPLOAD_FOLDER = './upload'
bucket = "pandemic-info-egy-test"

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db_username = "root"
db_password = "123456"
db_host = "localhost"
db_name = "covid_death_reports"

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{db_username}:{db_password}@{db_host}/{db_name}'

assets = Environment(app)
css = Bundle("src/main.css", output="dist/main.css", filters="postcss")

assets.register("css", css)
css.build()

db = SQLAlchemy(app)


class GenderType(enum.Enum):
    Any = "Any"
    Male = "Male"
    Female = "Female"


class CovidDeathReport(db.Model):
    __table_args__ = (
        db.UniqueConstraint('date', 'release_number'),
    )
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=True)
    report_link = db.Column(db.Text, nullable=True)
    report_total = db.Column(db.Integer, default=0)
    release_number = db.Column(db.String(50), nullable=True)
    date = db.Column(db.Date, nullable=False)
    has_full_detail_report = db.Column(db.Boolean, default=True)
    has_summery_detail_report = db.Column(db.Boolean, default=False)
    images = db.relationship("ReportImage", backref="covid_death_report", lazy=True)
    death_records = db.relationship("DeathRecord", backref="covid_death_report", lazy=True)
    death_report_summary = db.relationship("PressReleaseSummary", uselist=False, backref="covid_death_report",
                                           lazy=True)

    @hybrid_property
    def completed_count(self):
        if self.has_full_detail_report:
            return len(self.death_records)
        if self.has_summery_detail_report and self.death_report_summary \
                and self.death_report_summary.total_count_today == self.report_total \
                and self.death_report_summary.is_completed:
            return self.death_report_summary.total_count_today
        return 0

    @hybrid_property
    def is_completed(self):
        if self.has_full_detail_report and len(self.death_records) == self.report_total:
            return True
        if self.has_summery_detail_report and self.death_report_summary \
                and self.death_report_summary.total_count_today == self.report_total \
                and self.death_report_summary.is_completed:
            return True
        return False


class ReportImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_location = db.Column(db.Text())
    report_id = db.Column(db.Integer, db.ForeignKey('covid_death_report.id'),
                          nullable=False)


class PressReleaseSummary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    total_count_so_far = db.Column(db.Integer, default=0)
    total_count_today = db.Column(db.Integer, default=0)
    total_count_male = db.Column(db.Integer, default=0)
    total_count_female = db.Column(db.Integer, default=0)
    total_count_home = db.Column(db.Integer, default=0)
    total_count_hospital = db.Column(db.Integer, default=0)
    total_count_on_admission = db.Column(db.Integer, default=0)
    total_count_on_gov_hospital = db.Column(db.Integer, default=0)
    place_of_deaths = db.Column(db.Text)
    cause_of_deaths = db.Column(db.Text)
    note = db.Column(db.Text())
    death_records = db.relationship("MiniDeathRecord", backref="press_release_summary", lazy=True)
    age_groups = db.relationship("AgeGroup", backref="press_release_summary", lazy=True)
    report_id = db.Column(db.Integer, db.ForeignKey('covid_death_report.id'),
                          nullable=False)

    @hybrid_property
    def is_completed(self):
        print(f"R {self.total_count_home + self.total_count_hospital + self.total_count_on_admission}")
        print(f"G {self.total_count_male + self.total_count_female}")
        print(f"D {sum([d.count for d in self.death_records])}")
        print(f"A {sum([d.count for d in self.age_groups])}")
        if self.total_count_home + self.total_count_hospital + self.total_count_on_admission == \
                self.total_count_today and \
                self.total_count_male + self.total_count_female == self.total_count_today and \
                sum([d.count for d in self.death_records]) == self.total_count_today and \
                sum([d.count for d in self.age_groups]) == self.total_count_today:
            return True
        return False


#
#
class MiniDeathRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    report_date = db.Column(db.Date, nullable=False)
    count = db.Column(db.Integer, default=0)
    gender = db.Column(db.Enum(GenderType), default=GenderType.Any)
    report_summary_id = db.Column(db.Integer, db.ForeignKey('press_release_summary.id'), nullable=False)


class AgeGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.Integer, default=0)
    end = db.Column(db.Integer, default=0)
    count = db.Column(db.Integer, default=0)
    gender = db.Column(db.Enum(GenderType), default=GenderType.Any)
    report_summary_id = db.Column(db.Integer, db.ForeignKey('press_release_summary.id'),
                                  nullable=False)


class DeathRecord(db.Model):
    __table_args__ = (
        db.UniqueConstraint('record_number', 'report_date', 'report_id'),
    )
    id = db.Column(db.Integer, primary_key=True)
    record_number = db.Column(db.Integer, nullable=False)
    report_date = db.Column(db.Date, nullable=False)
    reason = db.Column(db.Text, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    age = db.Column(db.Float, nullable=False)  # To have months
    residence_location = db.Column(db.String(200), nullable=False)
    death_location = db.Column(db.String(200), nullable=False)
    reported_at = db.Column(db.String(50), nullable=False)
    note = db.Column(db.Text())
    report_id = db.Column(db.Integer, db.ForeignKey('covid_death_report.id'),
                          nullable=False)


db.create_all()


def make_unique(string):
    ident = uuid4().__str__()[:8]
    return f"{ident}-{string}"


@app.route("/")
def index():
    return redirect(url_for("all_reports"))


@app.route('/add', methods=['GET', 'POST'])
def create_press_release_recode():
    if request.method == 'POST':
        if 'report_date' not in request.form:
            return "Please select report date"
        if 'report_images' not in request.files:
            return 'there is no report_images in form!'

        uploaded_files = request.files.getlist("report_images")
        report_date = datetime.datetime.strptime(request.form["report_date"], '%Y-%m-%d')
        report_total = request.form["report_total"]
        report_link = request.form["report_link"]
        has_full_detail_report = False
        if "has_full_detail_report" in request.form:
            has_full_detail_report = request.form["has_full_detail_report"]
            has_full_detail_report = True if has_full_detail_report == "true" else False

        has_summery_detail_report = False
        if "has_summery_detail_report" in request.form:
            has_summery_detail_report = request.form["has_summery_detail_report"]
            has_summery_detail_report = True if has_summery_detail_report == "true" else False

        title, number = None, None
        if "report_title" in request.form:
            title = request.form["report_title"]
        if "release_number" in request.form:
            number = request.form["release_number"]

        if "death_report_id" in request.form and request.form["death_report_id"]:
            death_report_id = request.form["death_report_id"]
            death_report = CovidDeathReport.query.get(death_report_id)
            death_report.date = report_date.date()
            death_report.title = title
            death_report.number = number
            death_report.report_link = report_link
            death_report.report_total = report_total
            death_report.has_full_detail_report = has_full_detail_report
            death_report.has_summery_detail_report = has_summery_detail_report
            if uploaded_files and len(uploaded_files):
                for img in death_report.images:
                    db.session.delete(img)
        else:
            death_report = CovidDeathReport(date=report_date.date(),
                                            title=title,
                                            release_number=number,
                                            report_link=report_link,
                                            report_total=report_total,
                                            has_summery_detail_report=has_summery_detail_report,
                                            has_full_detail_report=has_full_detail_report
                                            )

        for file in uploaded_files:
            filename = make_unique(secure_filename(file.filename))
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(path)
            report_image = ReportImage(image_location=filename)
            death_report.images.append(report_image)
        if death_report.id is None:
            db.session.add(death_report)
        db.session.commit()
        return redirect(url_for("death_report_view", id=death_report.id))

    return render_template("add_report_form.html")


@app.route("/save_death_report_summary", methods=['POST'])
def save_death_report_summary():
    content = request.get_json()

    report_id = content["report_id"]
    total_count_so_far = content["total_count_so_far"]
    total_count_today = content["total_count_today"]
    total_count_male = content["total_count_male"]
    total_count_female = content["total_count_female"]
    total_count_home = content["total_count_home"]
    total_count_hospital = content["total_count_hospital"]
    total_count_on_admission = content["total_count_on_admission"]
    total_count_on_gov_hospital = content["total_count_on_gov_hospital"]
    place_of_deaths = content["place_of_deaths"]
    cause_of_deaths = content["cause_of_deaths"]

    total_by_date = content["deaths_total_by_date"]
    total_by_age_group = content["deaths_total_by_age_group"]
    note = content["note"]
    report: CovidDeathReport = CovidDeathReport.query.get(report_id)
    if report and report.has_summery_detail_report and report.death_report_summary:
        release_summary = report.death_report_summary
        release_summary.total_count_so_far = total_count_so_far
        release_summary.total_count_today = total_count_today
        release_summary.place_of_deaths = place_of_deaths
        release_summary.cause_of_deaths = cause_of_deaths
        release_summary.total_count_male = total_count_male
        release_summary.total_count_female = total_count_female
        release_summary.total_count_home = total_count_home
        release_summary.total_count_hospital = total_count_hospital
        release_summary.total_count_on_admission = total_count_on_admission
        release_summary.total_count_on_gov_hospital = total_count_on_gov_hospital
        release_summary.note = note
    else:
        release_summary = PressReleaseSummary(
            total_count_so_far=total_count_so_far,
            total_count_today=total_count_today,
            place_of_deaths=place_of_deaths,
            cause_of_deaths=cause_of_deaths,
            total_count_male=total_count_male,
            total_count_female=total_count_female,
            total_count_home=total_count_home,
            total_count_hospital=total_count_hospital,
            total_count_on_admission=total_count_on_admission,
            total_count_on_gov_hospital=total_count_on_gov_hospital,
            report_id=report_id,
            note=note
        )

    report.death_report_summary = release_summary
    for re in release_summary.death_records:
        db.session.delete(re)

    for re in release_summary.age_groups:
        db.session.delete(re)

    for tot_date in total_by_date:
        report_date = tot_date["date"]
        report_date = datetime.datetime.strptime(report_date, '%Y-%m-%d')
        number_of_deaths = tot_date["count"]
        release_summary.death_records.append(MiniDeathRecord(
            report_date=report_date,
            count=number_of_deaths
        ))
    release_summary.age_groups.clear()
    for tot_age in total_by_age_group:
        _from = tot_age["from"]
        _to = tot_age["to"]
        _count = tot_age["count"]

        release_summary.age_groups.append(AgeGroup(
            start=_from,
            end=_to,
            count=_count
        ))
    # release_summary.age_groups = age_groups
    # release_summary.death_records = death_records
    db.session.add(report)
    db.session.commit()
    return jsonify(content)


@app.route("/report/edit/<id>")
def death_report_edit(id):
    death_report = CovidDeathReport.query.get(id)
    return render_template("add_report_form.html", death_report=death_report)


@app.route("/report/<id>")
def death_report_view(id):
    death_report: CovidDeathReport = CovidDeathReport.query.get(id)
    print(death_report.is_completed)
    summary_report = None
    if death_report.has_summery_detail_report and death_report.death_report_summary:
        summary: PressReleaseSummary = death_report.death_report_summary
        summary_report = {
            "report_id": death_report.id,
            'total_count_today': summary.total_count_today,
            'total_count_so_far': summary.total_count_so_far,
            'total_count_male': summary.total_count_male,
            'total_count_female': summary.total_count_female,
            'total_count_home': summary.total_count_home,
            'total_count_hospital': summary.total_count_hospital,
            'total_count_on_admission': summary.total_count_on_admission,
            'total_count_on_gov_hospital': summary.total_count_on_gov_hospital,
            'cause_of_deaths': summary.cause_of_deaths,
            'place_of_deaths': summary.place_of_deaths,
            'note': summary.note,
        }

        death_records = summary.death_records
        age_groups = summary.age_groups

        summary_report["deaths_total_by_date"] = [{
            "date": dr.report_date.strftime('%Y-%m-%d'),
            "count": dr.count
        } for dr in death_records]
        summary_report["deaths_total_by_age_group"] = [{
            "from": ag.start,
            "to": ag.end,
            "count": ag.count
        } for ag in age_groups]

        summary_report = json.dumps(summary_report)

    record_images = [{
        "id": idx + 1,
        "image_location": url_for("upload", filename=img.image_location)
    } for idx, img in enumerate(death_report.images)]
    selected_record = None
    if "recode_id" in request.args:
        selected_record = DeathRecord.query.get(request.args.get("recode_id"))

    return render_template("death_reports_view.html", death_report=death_report, record_images=record_images,
                           selected_record=selected_record, summary_report=summary_report)


@app.route("/all")
def all_reports():
    reports = CovidDeathReport.query.order_by(CovidDeathReport.date.desc()).all()

    report_death_count = sum([r.report_total for r in reports])
    saved_death_count = sum([r.completed_count for r in reports])
    delete_key = ""
    if "delete_key" in request.args:
        delete_key = request.args.get("delete_key")

    return render_template("all_reports.html", reports=reports, report_total=report_death_count,
                           saved_total=saved_death_count, delete_key=delete_key)


@app.route('/uploads/<filename>')
def upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route("/save_death_recode", methods=["POST"])
def save_death_record():
    report_id = request.form["report_id"]

    report = CovidDeathReport.query.filter_by(id=report_id).first()

    form = request.form
    year, date, month = form["report_date_year"], form["report_date_date"], form["report_date_month"]
    report_date = datetime.datetime.strptime(f"{year}-{month}-{date}", '%Y-%m-%d')
    record_number = form["record_number"]
    reason = form["reason"]
    gender = form["gender"]
    age = form["age"]
    residence_location = form["residence_location"]
    death_location = form["death_location"]
    reported_at = form["reported_at"]
    note = form["note"]

    rec = DeathRecord.query.filter(
        (DeathRecord.record_number == record_number) & (DeathRecord.report_id == report.id)).first()

    if "record_id" not in request.form:
        if rec:
            flash('Index number already in')
            return redirect(request.referrer)
        death_record = DeathRecord(
            record_number=record_number,
            report_date=report_date.date(),
            reason=reason,
            gender=gender,
            age=age,
            residence_location=residence_location,
            death_location=death_location,
            reported_at=reported_at,
            note=note,
        )
        report.death_records.append(death_record)
        db.session.add(report)
    elif "record_id" in request.form:
        death_record = DeathRecord.query.get(request.form["record_id"])

        if rec and death_record.id != rec.id:
            flash('Index number already in')
            return redirect(request.referrer)

        death_record.record_number = record_number
        death_record.report_date = report_date
        death_record.reason = reason
        death_record.gender = gender
        death_record.age = age
        death_record.residence_location = residence_location
        death_record.death_location = death_location
        death_record.reported_at = reported_at
        death_record.note = note

    db.session.commit()

    return redirect(url_for("death_report_view", id=report.id))


@app.route("/report/delete/<id>", methods=["POST"])
def delete_report(id):
    report = CovidDeathReport.query.get(id)
    for img in report.images:
        try:
            filename = img.image_location
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            os.remove(path)
        except:
            pass
        db.session.delete(img)
    for re in report.death_records:
        db.session.delete(re)
    db.session.delete(report)
    db.session.commit()
    return redirect(url_for("all_reports"))


@app.route("/record/delete/<id>", methods=["POST"])
def delete_recode(id):
    # record = DeathRecord.query.get(id)
    # report = CovidDeathReport.query.get(record.report_id)
    # db.session.delete(record)
    # db.session.commit()
    return redirect(url_for("death_report_view", id=-1))


@app.route("/gen_summary")
def summary_report_generate():
    reports = CovidDeathReport.query.all()
    csv_data = []
    for report in reports:
        for dr in report.death_records:
            csv_data.append((
                report.date,
                dr.record_number,
                dr.report_date,
                dr.reason,
                dr.gender,
                dr.age,
                dr.residence_location,
                dr.death_location,
                dr.reported_at,
                0
            ))

    report_summaries = PressReleaseSummary.query.all()
    for rep_summary in report_summaries:

        rep_summary: PressReleaseSummary = rep_summary
        report: CovidDeathReport = CovidDeathReport.query.get(rep_summary.report_id)
        # Deaths
        deaths = []
        total_deaths: List[MiniDeathRecord] = rep_summary.death_records
        for td in total_deaths:
            for c in range(int(td.count)):
                deaths.append(td.report_date)
        if len(deaths) != rep_summary.total_count_today:
            raise Exception(f"Invalid Death Date Count, report ID :{report.id}")
        # Age
        ages = []
        age_deaths: List[AgeGroup] = rep_summary.age_groups
        for ad in age_deaths:
            avg_age = (int(ad.end) + int(ad.start)) / 2
            for a in range(int(ad.count)):
                ages.append(avg_age)

        if len(ages) != rep_summary.total_count_today:
            raise Exception(f"Invalid Age Group Count, report ID :{report.id}")
        # Gender
        male_count = rep_summary.total_count_male
        female_count = rep_summary.total_count_female
        genders = ["male" for m in range(int(male_count))]
        genders += ["female" for m in range(int(female_count))]
        if len(genders) != rep_summary.total_count_today:
            raise Exception(f"Invalid Gender Count, report ID :{report.id}")

        # Residence
        on_home = rep_summary.total_count_home
        on_admission = rep_summary.total_count_on_admission
        on_hospital = rep_summary.total_count_hospital
        reported_at_locations = ["home" for m in range(on_home)]
        reported_at_locations += ["on_admission" for m in range(on_admission)]
        reported_at_locations += ["hospital" for m in range(on_hospital)]

        if len(reported_at_locations) != rep_summary.total_count_today:
            raise Exception(f"Invalid Reported Location Count, report ID :{report.id}")

        for record_number, report_date, gender, age, reported_at in zip(range(rep_summary.total_count_today), deaths,
                                                                        genders,
                                                                        ages, reported_at_locations):
            csv_data.append((
                report.date,
                record_number,
                report_date,
                "COVID-19",
                gender,
                age,
                "SRI LANKA",
                "SRI LANKA",
                reported_at,
                1
            ))

    with open('data_summary.csv', mode='w') as csv_file:
        w = csv.writer(csv_file)
        # write header
        w.writerow(
            ('report_date', 'record_index', 'death_record_date', 'reason', 'gender', 'age', 'residence_location',
             'death_location', 'reported_at', 'artificial'))

        # write each log item
        for item in csv_data:
            w.writerow(item)
        csv_file.close()
    # Upload a new file

    return send_from_directory(os.path.join("."), 'data_summary.csv')


def _gen_summary_report(bucket_name=bucket):
    json_data = generate_summery()
    file_name = 'get_json_report.json'
    s3object = aws_client.Object(bucket, file_name)

    s3object.put(
        Body=(bytes(json.dumps(json_data).encode('UTF-8')))
    )
    object_acl = aws_client.ObjectAcl(bucket_name, file_name)
    response = object_acl.put(ACL='public-read')


@app.route("/download")
def download_report():
    return send_from_directory("./", 'data_summary.csv')


@app.route("/upload_summary/<bucket_name>")
def download_report_to_bucket(bucket_name):
    _gen_summary_report(bucket_name)
    return "success"


@app.route("/reason_auto_complete", methods=["GET"])
def get_reason_auto_complete():
    query = request.args.get("query")
    search = "%{}%".format(query)
    records = DeathRecord.query.filter(DeathRecord.reason.ilike(search)).all()
    reasons = [r.reason for r in records]
    reasons = list(dict.fromkeys(reasons))
    return jsonify(reasons)


@app.route("/location_auto_complete", methods=["GET"])
def get_location_auto_complete():
    query = request.args.get("query")
    search = "%{}%".format(query)
    records = DeathRecord.query.filter(DeathRecord.residence_location.ilike(search)).all()
    reasons = [r.residence_location for r in records]
    records = DeathRecord.query.filter(DeathRecord.death_location.ilike(search)).all()
    reasons += [r.death_location for r in records]
    reasons = list(dict.fromkeys(reasons))
    return jsonify(reasons)


@app.context_processor
def inject_today_date():
    return {'today_date': datetime.date.today()}


@app.route("/download_backup")
def download_backup():
    base_dir = tempfile.mkdtemp()
    temp_dir = os.path.join(base_dir, "backup")
    upload_path = os.path.join(temp_dir, 'upload')
    os.makedirs(upload_path)
    path = os.path.join(app.config['UPLOAD_FOLDER'], "")
    copy_tree(path, upload_path)
    sql_file_path = os.path.join(temp_dir, 'file.sql')
    try:
        with open(sql_file_path, 'w') as output:
            command_s = 'mysqldump -h%s -P 3306 -u%s -p%s %s' % (db_host, db_username, db_password, db_name)
            print(command_s)
            c = c = subprocess.Popen(command_s, stdout=output, shell=True)
            print(c)
            c.wait()
    except Exception as e:
        print(e)
    backup_file = os.path.join(base_dir, "backup.zip")
    zf = zipfile.ZipFile(backup_file, "w")
    for dirname, subdirs, files in os.walk(temp_dir):
        zf.write(dirname)
        for filename in files:
            zf.write(os.path.join(dirname, filename))
    zf.close()
    return send_from_directory(base_dir, "backup.zip")


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=7458)
