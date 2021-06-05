from datetime import datetime
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)


def generate_summary_report():
    df = pd.read_csv('data_summary.csv')
    dates = list(df.death_record_date.unique())
    dates += list(df.report_date.unique())
    dates = list(set(dates))
    dates.sort(key=lambda date: datetime.strptime(date, '%Y-%m-%d'))

    data_set_report_date = {f"{d}": 0 for d in dates}
    data_set_record_date = {f"{d}": 0 for d in dates}

    report_date_df = df.groupby("report_date").count()
    death_record_date_df = df.groupby("death_record_date").count()

    for t in report_date_df.itertuples():
        data_set_report_date[f"{t.Index}"] = int(t.death_record_date)

    for t in death_record_date_df.itertuples():
        data_set_record_date[f"{t.Index}"] = int(t.report_date)

    dates = data_set_record_date.keys()

    ### Generate summary by considering death report at same *date*
    report_date_summary = {}
    pre_rec = None
    for rd in dates:
        report_date_data = {f"{d}": 0 for d in dates}
        for t in df.itertuples():
            if rd == t.report_date and t.report_date == t.death_record_date:
                report_date_data[f"{t.report_date}"] += 1
        report_date_data = list(report_date_data.values())

        if pre_rec:
            report_date_data = [sum(x) for x in zip(pre_rec, report_date_data)]

        report_date_summary[rd] = report_date_data

        pre_rec = report_date_data

        ### Generate summary by considering death report at same *date*
    report_date_count_summary = {}
    pre_rec = None
    for rd in dates:
        report_date_data = {f"{d}": 0 for d in dates}
        for t in df.itertuples():
            if rd == t.report_date:
                report_date_data[f"{t.report_date}"] += 1
        report_date_data = list(report_date_data.values())

        if pre_rec:
            report_date_data = [sum(x) for x in zip(pre_rec, report_date_data)]

        report_date_count_summary[rd] = report_date_data

        pre_rec = report_date_data

    ### Generate summary by Considering Death record date
    record_date_summary = {}
    pre_rec = None
    for rd in dates:
        record_date_data = {f"{d}": 0 for d in dates}
        for t in df.itertuples():
            if rd == t.death_record_date:
                record_date_data[f"{t.death_record_date}"] += 1
        record_date_data = list(record_date_data.values())

        if pre_rec:
            record_date_data = [sum(x) for x in zip(pre_rec, record_date_data)]

        record_date_summary[rd] = record_date_data

        pre_rec = record_date_data
    ### Gender Summary
    gender_summary = {}
    pre_rec = None
    for rd in dates:
        gender_data = {
            "male": 0,
            "female": 0
        }
        for t in df.query(f"report_date=='{rd}'").itertuples():
            if "male" == t.gender:
                gender_data["male"] += 1
            elif "female" == t.gender:
                gender_data["female"] += 1
        if pre_rec:
            gender_data["male"] += pre_rec["male"]
            gender_data["female"] += pre_rec["female"]

        gender_summary[rd] = [
            {"name": "Male", "value": gender_data["male"]},
            {"name": "Female", "value": gender_data["female"]}
        ]

        pre_rec = gender_data

    data = {
        "dates": list(dates),
        "data": {
            "report_date_count": report_date_count_summary,
            "report_date": report_date_summary,
            "record_date": record_date_summary,
            "gender": gender_summary
        }
    }

    return data


@app.route("/daily_summary_report")
def daily_summary_report():
    data = generate_summary_report()
    # data = {
    #     "dates": ["2021-02-01", "2021-02-02", "2021-02-03"],
    #     "data": {
    #         "report_date": {
    #             "2021-02-01": [4, 0, 0],
    #             "2021-02-02": [8, 16, 0],
    #             "2021-02-03": [15, 20, 10],
    #         },
    #         "record_date": {
    #             "2021-02-01": [4, 0, 0],
    #             "2021-02-02": [4, 20, 0],
    #             "2021-02-03": [4, 20, 21],
    #         },
    #         "gender": {
    #             "2021-02-01": [{"name": "Male", "value": 58},
    #                            {"name": "Female", "value": 29}, ],
    #             "2021-02-02": [{"name": "Male", "value": 68},
    #                            {"name": "Female", "value": 36}, ],
    #             "2021-02-03": [{"name": "Male", "value": 100},
    #                            {"name": "Female", "value": 65}, ]
    #         }
    #     }
    # }
    return jsonify(data=data)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8787)
