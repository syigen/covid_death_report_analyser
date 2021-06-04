import React, { useEffect, useState } from 'react'
import HistogramReport from '../../components/charts/histogram_chart';
import PieChartReport from '../../components/charts/pie_chart';
const Dashboard = () => {

    const [deathSummary, setDeathSummary] = useState();

    useEffect(() => {

        setDeathSummary({
            dates: ["May 20", "May 21"],
            counts: [15, 200]
        })

    }, []);


    return (

        <div className={"grid grid-cols-12 gap-4 h-full"}>

            <div className={"col-span-12"}>
                <h1 className={"text-xl"}>Summary by record date</h1>
            </div>

            <div className={"col-span-12 md:col-span-8 h-full bg-red-400"}>

                {deathSummary && <HistogramReport title={"Deaths by date"} x={deathSummary.dates} y={deathSummary.counts} />}

            </div>


            <div className={"col-span-12 md:col-span-4 h-full w-full bg-red-400"}>

                <PieChartReport />

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