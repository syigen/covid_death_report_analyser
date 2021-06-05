import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const DeathReportAgeGroupWise = () => {
    const chartRef = useRef();
    const [chart, setChart] = useState();
    const [dataMap, setDataMap] = useState();

    useEffect(() => {
        if (chartRef) {
            const myChart = echarts.init(chartRef.current, 'dark');
            setChart(myChart);
        }
    }, [chartRef]);

    // useEffect(() => {
    //     const getData = async () => {
    //         const res = await fetch("http://127.0.0.1:7878/daily_summary_report")
    //         const data = await res.json();
    //         console.log(data);
    //         setDataMap(data.data)
    //     }
    //     getData();
    // }, [])

    useEffect(() => {
        if (chart) {
            // const dates = dataMap.dates;
            // console.log(dates);
            const option = {
                title: {
                    text:  'Age groups',
                },
                legend: {
                    data: ['Total', 'Male', 'Female']
                },
                radar: {
                    // shape: 'circle',
                    indicator: [
                        { name: '0-10' },
                        { name: '10-20' },
                        { name: '20-30' },
                        { name: '30-40' },
                        { name: '40-50' },
                        { name: '50-60' },
                        { name: '60-70' },
                        { name: '70-80' },
                        { name: '80-90' },
                        { name: '90' },
                    ]
                },
                series: [{
                    name: 'COVID Deaths Age group wise',
                    type: 'radar',
                    data: [
                        {
                            value: [20, 30, 40, 50, 60, 10, 80, 40, 50, 26, 10, 90, 5],
                            name: 'Total'
                        },

                        {
                            value: [20, 30, 40, 20, 60, 50, 80, 40, 9, 70, 10, 90, 5],
                            name: 'Male'
                        },

                        {
                            value: [20, 30, 40, 50, 30, 5, 8, 40, 50, 70, 10, 90, 5],
                            name: 'Female'
                        }
                    ]
                }]
            };;
            chart.setOption(option);
        }
    }, [chart, dataMap]);
    return (
        <div ref={chartRef} className="w-auto" style={{ "height": "600px" }} />
    );
}

export default DeathReportAgeGroupWise;