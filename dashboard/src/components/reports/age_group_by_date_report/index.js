import * as echarts from 'echarts';
import React, { useEffect, useRef, useState } from 'react';
import ChartReportCore from '../chart_report_core';

const DeathAgeGroupByDateReport = ({ rawData }) => {
    const chartRef = useRef();
    const [chart, setChart] = useState();
    const [dataMap, setDataMap] = useState();

    useEffect(() => {
        if (rawData) {
            const data = rawData.age_group_weekly_summary_by_date_report;
            setDataMap(data);
        }
    }, [rawData])

    useEffect(() => {
        if (chartRef) {
            const myChart = echarts.init(chartRef.current, 'chalk');
            setChart(myChart);
        }
    }, [chartRef]);


    useEffect(() => {
        if (chart && dataMap) {
            const hours = dataMap.dates;
            const days = dataMap.groups;
            var data = dataMap.data;

            const option = {
                title: {
                    text: "Age group weekly summary",
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
                xAxis: {
                    type: 'category',
                    data: hours,
                    splitArea: {
                        show: true
                    }
                },
                yAxis: {
                    type: 'category',
                    data: days,
                    splitArea: {
                        show: true
                    }
                },
                visualMap: {
                    min: 0,
                    max: 50,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    inRange: {
                        color: ["white", "gray", "rgb(255,240,30)", "rgb(255,240,200)", "rgb(240,10,10)"]
                    }
                },
                series: [{
                    name: 'Weekly Age Group Sumamry',
                    type: 'heatmap',
                    data: data,
                    label: {
                        show: true
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
            chart.setOption(option);
        }
    }, [chart, dataMap]);
    return (
        <div className="w-full h-full">
            <ChartReportCore
                sinhalaText={
                    <>
                        මෙම සටහන නිර්මාණයට මරණකරුගෙ වයස් කාණ්ඩය සතියක සම්පිණ්ඩයක් ලෙස ගෙන ඇත
                    </>
                }
                englishText={
                    <>
                        This chart uses ages of diseased summarized by week
                    </>
                }
                chartRef={
                    chartRef
                }
                className="w-auto h-full"
            />
        </div>
    );
}

export default DeathAgeGroupByDateReport;