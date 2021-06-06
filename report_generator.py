from datetime import datetime
import pandas as pd
import numpy as np


def get_count_summary_by_reported_and_record_same_date(df, dates):
    """
    Get count summary by considering report date and recorded on same date
    :param df:
    :param dates:
    :return:
    """
    _report_date_summary = {}
    pre_rec = None
    for rd in dates:
        report_date_data = {f"{d}": 0 for d in dates}
        for t in df.itertuples():
            if rd == t.report_date and t.report_date == t.death_record_date:
                report_date_data[f"{t.report_date}"] += 1
        report_date_data = list(report_date_data.values())

        if pre_rec:
            report_date_data = [sum(x) for x in zip(pre_rec, report_date_data)]

        _report_date_summary[rd] = report_date_data

        pre_rec = report_date_data
    return _report_date_summary


def get_report_date_count_summary(df, dates):
    """
    Get summary of count by considering report date
    :param df:
    :param dates:
    :return:
    """
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
    return report_date_count_summary


def get_count_summary_by_considering_record_date(df, dates):
    """
    Get report by considering death record date
    :param df:
    :param dates:
    :return:
    """
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
    return record_date_summary


def get_gender_summary(df, dates):
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
    return gender_summary


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

    report_date_summary = get_count_summary_by_reported_and_record_same_date(df, dates)
    report_date_count_summary = get_report_date_count_summary(df, dates)
    record_date_summary = get_count_summary_by_considering_record_date(df, dates)

    # Gender Summary
    gender_summary = get_gender_summary(df, dates)

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


def age_group_summary_report():
    """
    get age group wise data
    :return:
    """
    df = pd.read_csv('data_summary.csv')
    age_groups = ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90']
    age_group_bins = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, np.inf]

    def get_age_group_summary(_df):
        age_group_df_tot = pd.cut(_df['age'], bins=age_group_bins)
        age_group_df_tot = _df.groupby(age_group_df_tot).count()
        totals = []
        for age_g, count in zip(age_groups, age_group_df_tot.report_date.values):
            # group_summary_tot[f"{age_g}"] = int(count)
            totals.append(int(count))
        return totals

    group_summary_tot = get_age_group_summary(df)
    group_summary_male = get_age_group_summary(df.query("gender=='male'"))
    group_summary_female = get_age_group_summary(df.query("gender=='female'"))
    return {
        "indicator": age_groups,
        "all": group_summary_tot,
        "male": group_summary_male,
        "female": group_summary_female,
    }
