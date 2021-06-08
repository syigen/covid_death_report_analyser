function CreateSummeryForm(submitUrl) {
    const _submitUrl = submitUrl;
    let ageGroupNextId = 1;
    let dateDeathCountNextId = 1;
    return {
        dateDeathModal: {
            year: 2021,
            month: null,
            date: null,
            count: null
        },
        ageGroupModal: {
            from: null,
            to: null,
            count: null
        },
        ///
        ageGroups: [
            {from: 0, to: 9, count: 0},
            {from: 10, to: 19, count: 0},
            {from: 20, to: 29, count: 0},
            {from: 30, to: 39, count: 0},
            {from: 40, to: 49, count: 0},
            {from: 50, to: 59, count: 0},
            {from: 60, to: 69, count: 0},
            {from: 70, to: 79, count: 0},
            {from: 80, to: 89, count: 0},
            {from: 90, to: 99, count: 0},
            {from: 100, to: null, count: 0},
        ],
        reportDates: [],
        todayTotal: 0,
        soFarTotal: 0,
        maleCount: 0,
        femaleCount: 0,
        hospitalCount: 0,
        homeCount: 0,
        onAdmissionCount: 0,
        govHospitalCount: 0,
        areaOfResidence: "",
        causeOfDeath: "",
        init(summary_report) {
            const data = JSON.parse(summary_report);
            this.todayTotal = data.total_count_today;
            this.soFarTotal = data.total_count_so_far;
            this.maleCount = data.total_count_male
            this.femaleCount = data.total_count_female;
            this.homeCount = data.total_count_home;
            this.hospitalCount = data.total_count_hospital;
            this.onAdmissionCount = data.total_count_on_admission;
            this.govHospitalCount = data.total_count_on_gov_hospital;
            this.causeOfDeath = data.cause_of_deaths;
            this.areaOfResidence = data.place_of_deaths;
            this.reportDates = data.deaths_total_by_date.map(function (dt) {
                const id = dateDeathCountNextId;
                dateDeathCountNextId++;
                return {
                    "id": id,
                    "date": dt.date,
                    "count": dt.count
                }
            });
            this.ageGroups = data.deaths_total_by_age_group.map(function (ag) {
                const id = ageGroupNextId;
                ageGroupNextId++;
                return {
                    "id": id,
                    "from": ag.from,
                    "to": ag.to,
                    "count": ag.count
                }
            });
        },
        submitData() {
            const report_id = document.querySelector("#report_id").value;
            const formData = {
                'report_id': report_id,
                'total_count_today': this.todayTotal,
                'total_count_so_far': this.soFarTotal,
                'total_count_male': this.maleCount,
                'total_count_female': this.femaleCount,
                'total_count_home': this.homeCount,
                'total_count_hospital': this.hospitalCount,
                'total_count_on_admission': this.onAdmissionCount,
                'total_count_on_gov_hospital': this.govHospitalCount,
                'cause_of_deaths': this.causeOfDeath,
                'place_of_deaths': this.areaOfResidence,
                'deaths_total_by_date': this.reportDates.map(function (dt) {
                    return {
                        "date": dt.date,
                        "count": parseInt(dt.count)
                    }
                }),
                'deaths_total_by_age_group': this.ageGroups.map((ag) => {
                    return {
                        "from": parseInt(ag.from),
                        "to": parseInt(ag.to),
                        "count": parseInt(ag.count)
                    }
                }),
            }
            fetch(_submitUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(() => JSON.parse(JSON.stringify(formData)))
                .then((result) => {
                    location.reload();
                })
                .catch((error) => {
                    location.reload();
                });

        },

        getDeathDateTotal: function (reportDates) {
            let total = 0;
            for (const repDate in reportDates) {
                total += repDate.count
            }
            return total;
        },
        addDateDeathCount() {
            const modal = {...this.dateDeathModal}
            const year = modal.year
            const month = modal.month
            const date = modal.date
            const count = modal.count
            this.reportDates.unshift({
                "id": dateDeathCountNextId,
                "date": new Date(year, month, date, 0, 0, 0, 0),
                "count": parseInt(count)
            });
            this.dateDeathModal = {
                year: 2021,
                month: null,
                date: null,
                count: null
            };
            dateDeathCountNextId++
            document.querySelector('#date_death_modal_month').focus();
        },

        removeDateDeathCount(id) {
            let delIdx = -1;
            for (let i = 0; i < this.reportDates.length; i++) {
                if (this.reportDates[i].id === id) {
                    delIdx = i;
                    break;
                }
            }
            this.reportDates.splice(delIdx, 1);
        },

        addAgeGroup() {
            const modal = {...this.ageGroupModal}
            const from = modal.from
            const to = modal.to
            const count = modal.count
            this.ageGroups.unshift({
                "id": ageGroupNextId,
                "from": parseInt(from),
                "to": parseInt(to),
                "count": parseInt(count)
            });
            this.ageGroupModal = {
                from: null,
                to: null,
                count: null
            };
            ageGroupNextId++
            document.querySelector('#age_group_modal_from').focus();
        },

        removeAgeGroup(id) {
            let delIdx = -1;
            for (let i = 0; i < this.ageGroups.length; i++) {
                if (this.ageGroups[i].id === id) {
                    delIdx = i;
                    break;
                }
            }
            this.ageGroups.splice(delIdx, 1);
        },


    }

}