import React, { useEffect, useRef, useState } from 'react';
import echarts from '../../../chart_theme';
import ChartReportCore from '../chart_report_core';

const DeathReportLocationReport = ({ rawData }) => {
    const [chartOption, setChartOption] = useState();
    const [dataMap, setDataMap] = useState();

    useEffect(() => {
        if (rawData) {
            const data = rawData.death_report_location_report;
            setDataMap(data);
        }
    }, [rawData])

    useEffect(() => {
        if (dataMap) {
            const data = dataMap
            const option = {

                title: {
                    text: 'By Place of Death',
                    subtext: 'Based on Incident Announced Date',
                    padding: [
                        10,  // up
                        10, // left
                    ]
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: 'bottom',
                    left: 'center'
                },
                series: [
                    {
                        name: `Death Report Location`,
                        type: 'pie',
                        radius: '60%',
                        avoidLabelOverlap: true,
                        label: {
                            show: false,
                            position: 'left'
                        },
                        emphasis: {
                            label: {
                                show: true,
                            }
                        },
                        labelLine: {
                            show: true
                        },
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: function (params) {
                                        return params.name + "-" + params.percent + '%\n'
                                    },
                                },
                                labelLine: {
                                    show: true
                                },
                                textStyle: {
                                    color: '#000'
                                },
                                color: (item) => {

                                    let colorStops = [];

                                    if (item.name === "Hospital") {
                                        colorStops = [
                                            { offset: 0, color: 'rgba(232,237,0,1)' },
                                            { offset: 1, color: 'rgba(129,116,37,1)' }
                                        ]
                                    } else if (item.name === "Home") {
                                        colorStops = [
                                            { offset: 0, color: 'rgba(72,237,0,1)' },
                                            { offset: 1, color: ' rgba(37,129,37,1)' }
                                        ]
                                    } else if (item.name === "On Admission") {
                                        colorStops = [
                                            { offset: 0, color: 'rgba(190,0,245,1)' },
                                            { offset: 1, color: ' rgba(150,0,129,1)' }
                                        ]
                                    }

                                    return {
                                        type: 'linear',
                                        x: 0,
                                        y: 1,
                                        x2: 0,
                                        y2: 0,
                                        colorStops: colorStops
                                    }
                                },
                            },
                        },
                        data: data
                    }
                ]
            };
            setChartOption(option);
        }
    }, [dataMap]);
    return (
        <div className="w-full h-full">
            <ChartReportCore
                sinhalaText={
                    <>
                        මරණය සිදුවූ ස්තානය අනුව මෙම සටහන නිර්මාණය කර ඇත.
                    </>
                }
                englishText={
                    <>
                        This chart uses place of death of diseased
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
export default DeathReportLocationReport;