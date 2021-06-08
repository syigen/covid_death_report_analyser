import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import Api from '../../../api';

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
            const data_raw = await Api();
            const data = data_raw.age_group_summary_report;
            setDataMap(data)
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
                title: {
                    text: "Age group overoll summary",
                    subtext: 'Based on Incident Announced Date',
                    padding: [
                        10,  // up
                        10, // left
                    ]
                },
                tooltip: {
                    position: 'top'
                },
                grid: {
                    top: '15%'
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
                    name: 'Deaths Age group wise',
                    type: 'radar',                    
                    radius: '60%',
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
        <div ref={chartRef} className="w-auto h-full" />
    );
}

export default DeathReportAgeGroupWise;