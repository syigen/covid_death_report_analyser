import React, { useEffect, useRef, useState } from 'react';
import echarts from '../../../chart_theme';

const DeathReportLocationReport = ({rawData}) => {
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
            const data = rawData.death_report_location_report;
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
            const data = dataMap
            const option = {

                title: {
                    text: 'Incident occured place',
                    subtext: 'Based on Incident Announced Date'
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
                        itemStyle:{
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
            chart.setOption(option);
        }
    }, [chart, dataMap]);
    return (
        <div ref={chartRef}  className="w-auto h-full" />
    );
}
export default DeathReportLocationReport;