import React, { useEffect, useRef, useState } from 'react';
import echarts from '../../../chart_theme';

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
                    text: 'By Gender',
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
                    }
                },
                xAxis: {
                    type: 'category',
                    data: dates,
                    splitArea: {
                        show: true
                    }
                },
                yAxis: {

                },
                series: [
                    {
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
                                color: 'rgba(255, 0, 135)'
                            }, {
                                offset: 1,
                                color: 'rgba(135, 0, 157)'
                            }])
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: male
                    },
                    {
                        name: 'Female',
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
                        data: female
                    },
                ]
            };
            chart.setOption(option);
        }
    }, [chart, dataMap]);
    return (
        <div ref={chartRef} className="w-auto h-full" />
    );
}

export default DeathReportGenderWise;