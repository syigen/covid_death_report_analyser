import React, { useEffect, useRef, useState } from 'react';
import echarts from '../../../chart_theme';
import { dateFormatter } from '../../../utils';
import ChartReportCore from '../chart_report_core';

const DeathReportGenderWise = ({ rawData }) => {
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
        if (rawData) {
            const data = rawData.gender_weekly_summary_by_date_report;
            setDataMap(data);
        }
    }, [rawData])

    useEffect(() => {
        if (chartRef) {
            const myChart = echarts.init(chartRef.current, 'dark');
            setChart(myChart);
        }
    }, [chartRef]);

    useEffect(() => {
        const title = "Weekly summary by gender";
        if (chart && dataMap) {
            const data = dataMap.data;
            const dates = dataMap.dates;
            const male = data.map((dt) => {
                // return [dt.date, dt.male]
                return dt.male;
            });
            const female = data.map((dt) => {
                // return [dt.date, dt.female]
                return dt.female;
            });
            const option = {
                title: {
                    text: title,
                    subtext: 'Based on Incident Announced Date',
                    padding: [
                        10,  // up
                        10, // left
                    ]
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                    formatter: (params) => {
                        const section1 = params[0];
                        const section2 = params[1];
                        return `<span style="font-weight:bold;margin-bottom:4px;">${title}</span><br />
                        <div style="">${dateFormatter(section1.name, 'MMMM')}</div>
                        <div class="flex flex-wrap items-baseline">
      <div class="text-gray-700">
      ${section1.marker} ${section1.seriesName}
      </div>
      <div class="text-gray-700 ml-3">
      ${section1.data}
      </div>
    </div>
    <div class="flex flex-wrap items-baseline">
    <div class="text-gray-700">
    ${section2.marker} ${section2.seriesName}
    </div>
    <div class="text-gray-700 ml-3">
    ${section2.data}
    </div>
  </div>                       
                        `;
                    }
                },
                xAxis: {
                    type: 'category',
                    data: dates,
                    splitArea: {
                        show: true
                    },
                    axisLabel: {
                        formatter: (label) => dateFormatter(label, "MMM"),
                    },
                    
                    name: 'Week'
                },
                yAxis: {
                    type: 'value',                    
                    name: 'Count'
                },
                grid: {
                    top: '20%',
                    left: 40,
                },
                legend: {
                    top: 'bottom',
                    data: ['Male', 'Female']
                },
                series: [

                    {
                        name: 'Female',
                        type: 'line',
                        stack: 'gender',
                        smooth: true,
                        lineStyle: {
                            width: 0
                        },
                        showSymbol: false, areaStyle: {
                            opacity: 0.8,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(255, 0, 135)'
                            }, {
                                offset: 1,
                                color: 'rgba(135, 0, 157)'
                            }])
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: female
                    }, {
                        name: 'Male',
                        type: 'line',
                        stack: 'gender',
                        smooth: true,
                        lineStyle: {
                            width: 0
                        },
                        showSymbol: false,

                        areaStyle: {
                            opacity: 0.8,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(55, 162, 255)'
                            }, {
                                offset: 1,
                                color: 'rgba(116, 21, 219)'
                            }])
                        },

                        emphasis: {
                            focus: 'series'
                        },
                        data: male
                    },
                ]
            };
            chart.setOption(option);
        }
    }, [chart, dataMap]);
    return (
        <div className="w-full h-full">
            <ChartReportCore
                sinhalaText={
                    <>
                        මෙම සටහන නිර්මාණයට මරණකරුගෙ ස්ත්‍රී පුරුෂ භාවය අනුව එකතුව සතියක සම්පිණ්ඩයක් ලෙස ගෙන ඇත
                    </>
                }
                englishText={
                    <>
                        This chart uses gender of diseased summarized by week
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

export default DeathReportGenderWise;