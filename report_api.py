from flask import Flask, jsonify
from flask_cors import CORS

import report_generator as reg
import app_helper as app_h

app = Flask(__name__)
CORS(app)


@app.route("/get_json_report")
def save_summery_reports():
    data = app_h.generate_summery()
    return jsonify(data)


@app.route("/daily_summary_report")
def daily_summary_report():
    data = reg.generate_summary_report()
    return jsonify(data=data)


@app.route("/age_group_summary_report")
def age_group_summary_report():
    data = reg.age_group_summary_report()
    return jsonify(data=data)


@app.route("/death_report_location_report")
def death_report_location_report():
    data = reg.get_death_report_location_summary()
    return jsonify(data=data)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8787)
