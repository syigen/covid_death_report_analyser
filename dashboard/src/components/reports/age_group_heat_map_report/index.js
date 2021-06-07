import React, { useState, useEffect, useRef } from 'react';
import Api from '../../../api';
import echarts from '../../../chart_theme';

const DeathReportAgeGroupHeatMap = () => {
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
            const xData = dataMap.indicator;
            const all = dataMap.all;
            const male = dataMap.male;
            const female = dataMap.female;
            const option = {
                title: {
                    text: "Age group overoll summary",
                    subtext: 'Based on Incident Announced Date'
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
                }, 
                series: [{
                    type: 'bar',
                    data: female,
                    coordinateSystem: 'polar',
                    name: 'Female',
                    stack: 'a',
                    emphasis: {
                        focus: 'series'
                    }
                }, {
                    type: 'bar',
                    data: male,
                    coordinateSystem: 'polar',
                    name: 'Male',
                    stack: 'a',
                    emphasis: {
                        focus: 'series'
                    }
                }, {
                    type: 'bar',
                    data: all,
                    coordinateSystem: 'polar',
                    name: 'All',
                    stack: 'a',
                    emphasis: {
                        focus: 'series'
                    }
                }],
                legend: {
                    top: 'bottom',
                    show: true,
                    data: ['All', 'Female', 'Male']
                }
            };
            chart.setOption(option);
        }
    }, [chart, dataMap]);
    return (
        <div ref={chartRef} className="w-auto h-full" />
    );
}

export default DeathReportAgeGroupHeatMap;