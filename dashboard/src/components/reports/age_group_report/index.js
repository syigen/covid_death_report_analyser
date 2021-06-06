import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const DeathReportAgeGroupWise = () => {
    const chartRef = useRef();
    const [chart, setChart] = useState();
    const [dataMap, setDataMap] = useState();

    useEffect(() => {
        if (chartRef) {
            const myChart = echarts.init(chartRef.current, 'chalk');
            setChart(myChart);
        }
    }, [chartRef]);

    useEffect(() => {
        const getData = async () => {
            const res = await fetch("http://127.0.0.1:7878/age_group_summary_report")
            const data = await res.json();
            // console.log(data);
            setDataMap(data.data)
        }
        getData();
    }, [])

    useEffect(() => {
        if (chart && dataMap) {

            const all = dataMap.all;
            const male = dataMap.male;
            const female = dataMap.female;

            const indicator = dataMap.indicator.map((i, idx) => {
                return { name: i, max: all[idx] };
            });


            const option = {
                tooltip: {
                    position: 'top'
                },
                title: {
                    text: 'Age groups',
                },
                legend: {
                    data: ['Total', 'Male', 'Female']
                },
                radar: {
                    // shape: 'circle',
                    indicator: [
                        ...indicator
                    ]
                },
                series: [{
                    name: 'COVID Deaths Age group wise',
                    type: 'radar',
                    data: [
                        {
                            value: all,
                            name: 'Total'
                        },

                        {
                            value: male,
                            name: 'Male'
                        },

                        {
                            value: female,
                            name: 'Female'
                        }
                    ]
                }]
            };;
            chart.setOption(option);
        }
    }, [chart, dataMap]);
    return (
        <div ref={chartRef}  className="w-auto h-full" />
    );
}

export default DeathReportAgeGroupWise;