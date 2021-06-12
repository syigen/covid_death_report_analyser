from datetime import datetime, timedelta, timezone
import pandas as pd
import numpy as np


def _read_summary_csv():
    df = pd.read_csv('data_summary.csv')
    return df


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


def get_report_date_distribution_summary(df, dates):
    reports_dates = list(df.report_date.unique())
    data_summary = {}
    for d in reports_dates:
        data_set_record_date = {f"{d}": 0 for d in dates}
        death_record_date_df = df.query(f"report_date=='{d}'").groupby("death_record_date").count()
        for t in death_record_date_df.itertuples():
            data_set_record_date[f"{t.Index}"] = int(t.report_date)
        data_summary[f"{d}"] = list(data_set_record_date.values())
    return data_summary


def generate_summary_report():
    df = _read_summary_csv()
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
    report_date_distribution_summary = get_report_date_distribution_summary(df, dates)

    # Gender Summary
    gender_summary = get_gender_summary(df, dates)

    data = {
        "dates": list(dates),
        "data": {
            "report_date_count": report_date_count_summary,
            "report_date": report_date_summary,
            "record_date": record_date_summary,
            "selected_date": report_date_distribution_summary,
            "gender": gender_summary
        }
    }

    return data


def age_group_summary_report():
    """
    get age group wise data
    :return:
    """
    df = _read_summary_csv()
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


def get_death_report_location_summary():
    """
    Get Place of death report
    :return:
    """
    df = _read_summary_csv()
    reported_at_df = df.groupby("reported_at").count()
    _death_location_summary = {}
    for v in reported_at_df.itertuples():
        key = f"{v.Index}"
        if key == "gov_hospital":
            key = "hospital"
        if key == "pvt_hospital":
            key = "hospital"
        if key not in _death_location_summary:
            _death_location_summary[key] = 0
        _death_location_summary[key] += int(v.report_date)

    death_location_summary = []
    for v in _death_location_summary.keys():
        val = _death_location_summary[v]
        death_location_summary.append({
            "name": f"{v}".replace("_", " ").title(),
            "value": val
        })
    return death_location_summary


def age_group_summary_by_date_report():
    df = _read_summary_csv()
    dates = list(df.death_record_date.unique())
    dates += list(df.report_date.unique())
    dates = list(set(dates))
    dates.sort(key=lambda date: datetime.strptime(date, '%Y-%m-%d'))

    age_groups = ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90']
    age_group_bins = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, np.inf]

    summary = {}
    data = []
    df['report_date'] = pd.to_datetime(df['report_date']) - pd.to_timedelta(7, unit='d')
    for idx, d in enumerate(dates):
        date_d = datetime.strptime(d, '%Y-%m-%d')
        _df_temp = df.query(f"report_date=='{d}'")
        if len(_df_temp) > 0:
            age_group_df = pd.cut(_df_temp['age'], bins=age_group_bins)
            age_group_df = _df_temp.groupby(age_group_df).count()

            group_summary = {}
            for age_g, count in zip(age_groups, age_group_df.report_date.values):
                group_summary[f"{age_g}"] = int(count)
                # data.append([date_d.weekday(), age_groups.index(f"{age_g}"), int(count)])
                data.append([idx, age_groups.index(f"{age_g}"), int(count)])

            summary[f"{d}"] = list(group_summary.values())

    return {
        "groups": age_groups,
        "dates": list(summary.keys()),
        "data": data
    }


def age_group_summary_by_week_report():
    df_temp = _read_summary_csv()
    df_temp['report_date'] = pd.to_datetime(df_temp['report_date']) - pd.to_timedelta(7, unit='d')
    df_temp['daysoffset'] = df_temp['report_date'].apply(lambda x: x.weekday())
    # We apply, row by row (axis=1) a timedelta operation
    df_temp['report_date_week'] = df_temp.apply(lambda x: x['report_date'] - timedelta(days=x['daysoffset']), axis=1)

    wk_dates = list(df_temp.report_date_week.unique())
    wk_dates = list(set(wk_dates))
    wk_dates.sort(key=lambda date: datetime.fromtimestamp(date.item() / 10 ** 9))

    age_groups = ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90']
    age_group_bins = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, np.inf]
    summary = {}

    data = []
    total_count = 0
    for idx, d in enumerate(wk_dates):
        d = datetime.fromtimestamp(d.item() / 10 ** 9).strftime('%Y-%m-%d')
        _df_temp = df_temp.query(f"report_date_week=='{d}'")
        if len(_df_temp) > 0:
            age_group_df = pd.cut(_df_temp['age'], bins=age_group_bins)
            age_group_df = _df_temp.groupby(age_group_df).count()

            group_summary = {}
            for age_g, count in zip(age_groups, age_group_df.report_date_week.values):
                group_summary[f"{age_g}"] = int(count)
                data.append([idx, age_groups.index(f"{age_g}"), int(count)])

            summary[f"{d}"] = list(group_summary.values())

    return {
        "groups": age_groups,
        "dates": list(summary.keys()),
        "raw_data": summary,
        "data": data
    }


def get_gender_summary_repored_date_weekly():
    df = _read_summary_csv()
    df['report_date'] = pd.to_datetime(df['report_date']) - pd.to_timedelta(7, unit='d')
    df['daysoffset'] = df['report_date'].apply(lambda x: x.weekday())
    # We apply, row by row (axis=1) a timedelta operation
    df['report_date_week'] = df.apply(lambda x: x['report_date'] - timedelta(days=x['daysoffset']), axis=1)

    dates = list(df.report_date_week.unique())
    dates = list(set(dates))
    dates.sort(key=lambda date: datetime.fromtimestamp(date.item() / 10 ** 9))
    gender_summary = {}
    data = []
    for rd in dates:
        rd = datetime.fromtimestamp(rd.item() / 10 ** 9).strftime('%Y-%m-%d')
        gender_data = {
            "male": 0,
            "female": 0
        }
        for t in df.query(f"report_date_week=='{rd}'").itertuples():
            if "male" == t.gender:
                gender_data["male"] += 1
            elif "female" == t.gender:
                gender_data["female"] += 1

        record = [
            {"name": "Male", "value": gender_data["male"]},
            {"name": "Female", "value": gender_data["female"]}
        ]
        data.append({
            "date": f"{rd}",
            "male": gender_data["male"],
            "female": gender_data["female"],
        })
        gender_summary[rd] = record
    return {
        "dates": list(gender_summary.keys()),
        "raw_data": gender_summary,
        "data": data
    }


def get_about_report():
    df = _read_summary_csv()
    dates = list(df.report_date.unique())
    # dates += list(df.report_date.unique())
    dates = list(set(dates))
    dates.sort(key=lambda date: datetime.strptime(date, '%Y-%m-%d'))
    from_date = dates[0]
    to_date = dates[-1]
    return {
        "from_date": from_date,
        "to_date": to_date,
        "total_records": len(df),
        "total_press_release": len(df.report_date.unique()),
        "last_update_time": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S %Z")
    }
