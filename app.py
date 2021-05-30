import csv
import datetime
import os
from io import StringIO
from uuid import uuid4

from flask import Flask, request, render_template, send_from_directory, redirect, url_for, Response
from flask_assets import Environment
from flask_sqlalchemy import SQLAlchemy
from webassets import Bundle
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = './upload'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123456@localhost/covid_death_reports'

assets = Environment(app)
css = Bundle("src/main.css", output="dist/main.css", filters="postcss")

assets.register("css", css)
css.build()

db = SQLAlchemy(app)


class CovidDeathReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, unique=True, nullable=False)
    images = db.relationship("ReportImage", backref="covid_death_report", lazy=True)
    death_records = db.relationship("DeathRecord", backref="covid_death_report", lazy=True)


class ReportImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_location = db.Column(db.Text())
    report_id = db.Column(db.Integer, db.ForeignKey('covid_death_report.id'),
                          nullable=False)


class DeathRecord(db.Model):
    __table_args__ = (
        db.UniqueConstraint('record_number', 'report_date'),
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
    return render_template("index.html")


@app.route('/add', methods=['GET', 'POST'])
def create_press_release_recode():
    if request.method == 'POST':
        if 'report_date' not in request.form:
            return "Please select report date"
        if 'report_images' not in request.files:
            return 'there is no report_images in form!'

        uploaded_files = request.files.getlist("report_images")
        report_date = datetime.datetime.strptime(request.form["report_date"], '%Y-%m-%d')

        death_report = CovidDeathReport(date=report_date.date())

        for file in uploaded_files:
            filename = make_unique(secure_filename(file.filename))
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(path)
            report_image = ReportImage(image_location=filename)
            death_report.images.append(report_image)
        db.session.add(death_report)
        db.session.commit()
        return redirect(url_for("all_reports"))

    return render_template("add_report_form.html")


@app.route("/report/<date>")
def death_report_view(date):
    death_report = CovidDeathReport.query.filter_by(date=date).first()
    record_images = [{
        "id": idx + 1,
        "image_location": url_for("upload", filename=img.image_location)
    } for idx, img in enumerate(death_report.images)]
    return render_template("death_reports_view.html", death_report=death_report, record_images=record_images)


@app.route("/all")
def all_reports():
    reports = CovidDeathReport.query.all()
    return render_template("all_reports.html", reports=reports)


@app.route('/uploads/<filename>')
def upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route("/save_death_recode", methods=["POST"])
def save_death_record():
    report_id = request.form["report_id"]

    report = CovidDeathReport.query.filter_by(id=report_id).first()

    form = request.form

    report_date = datetime.datetime.strptime(form["report_date"], '%Y-%m-%d')
    record_number = form["record_number"]
    reason = form["reason"]
    gender = form["gender"]
    age = form["age"]
    residence_location = form["residence_location"]
    death_location = form["death_location"]
    reported_at = form["reported_at"]

    death_record = DeathRecord(
        record_number=record_number,
        report_date=report_date.date(),
        reason=reason,
        gender=gender,
        age=age,
        residence_location=residence_location,
        death_location=death_location,
        reported_at=reported_at
    )
    report.death_records.append(death_record)
    db.session.add(report)
    db.session.commit()

    return redirect(url_for("death_report_view", date=report.date))


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
    record = DeathRecord.query.get(id)
    report = CovidDeathReport.query.get(record.report_id)
    db.session.delete(record)
    db.session.commit()
    return redirect(url_for("death_report_view", date=report.date))


@app.route("/download")
def download_report():
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
            ))

    def generate():
        data = StringIO()
        w = csv.writer(data)

        # write header
        w.writerow(('report_date', 'record_index', 'death_record_date', 'reason', 'gender', 'age', 'residence_location',
                    'death_location', 'reported_at'))
        yield data.getvalue()
        data.seek(0)
        data.truncate(0)

        # write each log item
        for item in csv_data:
            w.writerow(item)
            yield data.getvalue()
            data.seek(0)
            data.truncate(0)
        # stream the response as the data is generated

    response = Response(generate(), mimetype='text/csv')
    # add a filename
    response.headers.set("Content-Disposition", "attachment", filename="report.csv")
    return response


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=7458)
