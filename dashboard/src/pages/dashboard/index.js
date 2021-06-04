import React from 'react';
import HistogramReport from '../../components/charts/histogram_chart';
import DeathReportGenderWise from '../../components/reports/death_report_gender_wise';
import TotalDeathReport from '../../components/reports/total_death_report';
const Dashboard = () => {

    return (

        <div className={"grid grid-cols-12 gap-4 h-full"}>

            <div className={"col-span-12"}>
                <h1 className={"text-xl"}>Summary by record date</h1>
            </div>

            <div className={"col-span-12 w-screen h-full bg-red-400"}>

                <TotalDeathReport />

            </div>


            <div className={"col-span-12 md:col-span-4 h-full w-full bg-red-400"}>

                <DeathReportGenderWise />

            </div>



            <div className={"col-span-12  md:col-span-4  h-full bg-red-400"}>

                <HistogramReport />

            </div>



            <div className={"col-span-12 sm:col-span-12 md:col-span-4  h-96"}>

                <HistogramReport />

            </div>



            <div className={"col-span-12 md:col-span-4  h-96"}>

                <HistogramReport />

            </div>

        </div>

    );
}

export default Dashboard;