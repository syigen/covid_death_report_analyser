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