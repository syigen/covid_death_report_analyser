import React, { useState, useEffect, useRef } from 'react';
import Api from '../../../api';
import echarts from '../../../chart_theme';

const DeathReportLocationReport = () => {
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
            const data = data_raw.death_report_location_report;
            setDataMap(data)
        }
        getData();
    }, [])

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
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
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