import React, { useEffect, useState } from 'react';
import { dateFormatter } from '../../../utils';
import ChartReportCore from '../chart_report_core';



const DeathAgeGroupByDateReport = ({ rawData }) => {
    const [chartOption, setChartOption] = useState();
    const [dataMap, setDataMap] = useState();

    useEffect(() => {
        if (rawData) {
            const data = rawData.age_group_weekly_summary_by_date_report;
            setDataMap(data);
        }
    }, [rawData])




    useEffect(() => {
        if (dataMap) {
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
                    position: 'top',
                    formatter: (params) => {
                        if(!params.seriesName){
                            return "";
                        }
                        return `<span style="font-weight:bold;margin-bottom:4px;">${params.seriesName}</span><br />
                       <small> ${params.name}</small><br/>
                        <div style="float:left;">${params.marker} ${dateFormatter(params.name, 'MMMM')}</div> <div style="float:right">${(params.data && params.data.length >= 2) ? params.data[2] : '000'}</div>`;
                    }
                },
                grid: {
                    top: '20%',
                    left: 40,
                },
                xAxis: {
                    type: 'category',
                    data: hours,
                    splitArea: {
                        show: true
                    },
                    axisLabel: {
                        formatter: (label) => dateFormatter(label, "MMM"),
                    },
                    name: 'Week'
                },
                yAxis: {
                    type: 'category',
                    data: days,
                    splitArea: {
                        show: true
                    },
                    name: 'Age group'
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
                        show: true,
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
            setChartOption(option);
        }
    }, [dataMap]);
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
                option={
                    chartOption
                }
                className="w-auto h-full"
            />
        </div>
    );
}

export default DeathAgeGroupByDateReport;