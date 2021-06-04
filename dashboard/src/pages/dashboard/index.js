import React from 'react'
import HistogramReport from '../../components/reports/histogram_report';
const Dashboard = () => {

    return (

        <div className={"grid grid-cols-12 gap-4 h-full"}>

            <div className={"col-span-12"}>
                <h1 className={"text-xl"}>Summary by record date</h1>
            </div>

            <div className={"col-span-12 md:col-span-8 h-full bg-red-400"}>

                <HistogramReport title={"Deaths by date"} x={['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks']} y={[1, 2, 3, 1, 2, 5]} />

            </div>


            <div className={"col-span-12 md:col-span-4 h-full bg-red-400"}>

                <HistogramReport />

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