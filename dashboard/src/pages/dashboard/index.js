import React from 'react';
import DeathAgeGroupByDateReport from '../../components/reports/age_group_by_date_report';
import DeathReportAgeGroupHeatMap from '../../components/reports/age_group_heat_map_report';
import DeathReportAgeGroupWise from '../../components/reports/age_group_report';
import DeathReportLocationReport from '../../components/reports/death_report_location_report';
import TotalDeathReport from '../../components/reports/total_death_report';
import TotalDeathOccuredReport from '../../components/reports/total_death_report_on_occured';
const Dashboard = () => {

    return (

        <div className={"grid grid-cols-12 gap-2 min-h-screen"}>

            <div className={"col-span-12 w-full"}>
                <div className={"w-full p-2"}>
                    <TotalDeathOccuredReport />
                </div>
            </div>


            <div className={"col-span-12 md:col-span-8"}>

                <div className={"p-2  h-full w-full"}>
                    <DeathAgeGroupByDateReport />
                </div>
            </div>



            <div className={"col-span-12  md:col-span-4"} style={{ "height": "30rem" }}>

                <div className={"p-2  h-full w-full"}>
                    <DeathReportAgeGroupHeatMap />
                </div>
            </div>



            <div className={"col-span-12  md:col-span-8"}>

                <div className={"p-2 h-full w-full"}>
                    <DeathReportLocationReport />
                </div>
            </div>


            <div className={"col-span-12  md:col-span-4"} style={{ "height": "30rem" }}>

                <div className={"p-2 h-full w-full"}>
                    <DeathReportLocationReport />
                </div>
            </div>

            <div className={"col-span-12 w-full"}>

                <div className={"w-full p-2"}>
                    <TotalDeathReport />
                </div>

            </div>

        </div>

    );
}

export default Dashboard;