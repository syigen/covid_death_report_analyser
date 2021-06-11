import report_generator as reg


def generate_summery():
    data = {
        "about_report": reg.get_about_report(),
        "daily_summary_report": reg.generate_summary_report(),
        "age_group_summary_report": reg.age_group_summary_report(),
        "age_group_weekly_summary_by_date_report": reg.age_group_summary_by_week_report(),
        "gender_weekly_summary_by_date_report": reg.get_gender_summary_repored_date_weekly(),
        "death_report_location_report": reg.get_death_report_location_summary()
    }
    return data
