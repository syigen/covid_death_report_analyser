import React from 'react';
import DeathReportAgeGroupHeatMap from '../../components/reports/age_group_heat_map_report';
import DeathReportAgeGroupWise from '../../components/reports/age_group_report';
import DeathReportLocationReport from '../../components/reports/death_report_location_report';
import TotalDeathReport from '../../components/reports/total_death_report';
const Dashboard = () => {

    return (

        <div className={"grid grid-cols-12 gap-4 h-full"}>

            <div className={"col-span-12"}>
                <h1 className={"text-xl"}>Summary by record date</h1>
            </div>

            <div className={"col-span-12 w-screen  "}>

                <TotalDeathReport />

            </div>


            <div className={"col-span-12 md:col-span-4 h-full w-full "}>

                <DeathReportAgeGroupWise />

            </div>



            <div className={"col-span-12  md:col-span-4  h-full "}>

                <DeathReportAgeGroupHeatMap />

            </div>



            <div className={"col-span-12 sm:col-span-12 md:col-span-4  h-96"}>

                <DeathReportLocationReport />

            </div>

        </div>

    );
}

export default Dashboard;