import React, { useEffect, useState } from 'react';
import ChartReportCore from '../chart_report_core';

const DeathReportAgeGroupHeatMap = ({ rawData }) => {
    const [chartOption, setChartOption] = useState();
    const [dataMap, setDataMap] = useState();

    useEffect(() => {
        if (rawData) {
            const data = rawData.age_group_summary_report;
            setDataMap(data);
        }
    }, [rawData])

    useEffect(() => {
        if (dataMap) {
            const xData = dataMap.indicator;
            const all = dataMap.all;
            const male = dataMap.male;
            const female = dataMap.female;
            const option = {
                title: {
                    text: "Age group overall summary",
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
                    top: 100
                },
                angleAxis: {
                    type: 'category',
                    data: xData
                },
                radiusAxis: {
                },
                polar: {
                    radius: '60%',
                },
                series: [{
                    type: 'bar',
                    data: female,
                    coordinateSystem: 'polar',

                    radius: '60%',
                    name: 'Female',
                    stack: 'a',
                    emphasis: {
                        focus: 'series'
                    },

                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    { offset: 0, color: 'rgba(255, 0, 135)' },
                                    { offset: 1, color: 'rgba(135, 0, 157)' }
                                ]
                            },
                        }
                    }
                }, {
                    type: 'bar',
                    radius: '60%',
                    data: male,
                    coordinateSystem: 'polar',
                    name: 'Male',
                    stack: 'a',
                    emphasis: {
                        focus: 'series'
                    },

                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    { offset: 0, color: 'rgba(55, 162, 255)' },
                                    { offset: 1, color: 'rgba(116, 21, 219)' }
                                ]
                            },
                        }
                    }
                }, {
                    type: 'bar',
                    data: all,
                    coordinateSystem: 'polar',
                    name: 'All',
                    stack: 'a',
                    emphasis: {
                        focus: 'series'
                    },
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    { offset: 0, color: 'rgba(255, 170, 0)' },
                                    { offset: 1, color: 'rgba(170, 255, 0)' }
                                ]
                            },
                        }
                    }
                }],
                legend: {
                    top: 'bottom',
                    show: true,
                    data: ['All', 'Female', 'Male']
                }
            };
            setChartOption(option);
        }
    }, [dataMap]);
    return (
        <div className="w-full h-full">
            <ChartReportCore
                sinhalaText={
                    <>
                        ????????? ???????????? ??????????????????????????? ???????????????????????? ???????????? ?????????????????? ???????????????????????? ???????????? ???????????????????????? ????????????????????????????????? ????????? ????????? ??????
                    </>
                }
                englishText={
                    <>
                        This chart uses ages of diseased
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

export default DeathReportAgeGroupHeatMap;