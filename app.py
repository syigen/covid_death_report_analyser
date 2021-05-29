import os
from flask import Flask, request, render_template, send_from_directory, redirect, url_for
from flask_assets import Environment
from flask_sqlalchemy import SQLAlchemy
from webassets import Bundle

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
    date = db.Column(db.String(80), unique=True, nullable=False)
    images = db.relationship("ReportImage", backref="covid_death_report", lazy=True)
    death_records = db.relationship("DeathRecord", backref="covid_death_report", lazy=True)


class ReportImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_location = db.Column(db.Text())
    report_id = db.Column(db.Integer, db.ForeignKey('covid_death_report.id'),
                          nullable=False)


class DeathRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
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


@app.route("/")
def index():
    return render_template("index.html")


@app.route('/add', methods=['GET', 'POST'])
def create_press_release_recode():
    if request.method == 'POST':
        if 'report_date' not in request.form:
            return "Please select report date"

        if 'file1' not in request.files:
            return 'there is no file1 in form!'
        uploaded_files = request.files.getlist("file1")
        report_date = request.form["report_date"]
        death_report = CovidDeathReport(date=report_date)
        for file in uploaded_files:
            filename = file.filename
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
    return render_template("death_reports_view.html", death_report=death_report)


@app.route("/all")
def all_reports():
    reports = CovidDeathReport.query.all()
    return render_template("all_reports.html", reports=reports)


@app.route('/uploads/<filename>')
def upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == '__main__':
    app.run()
