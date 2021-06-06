import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const DeathReportAgeGroupHeatMap = () => {
    const chartRef = useRef();
    const [chart, setChart] = useState();
    const [dataMap, setDataMap] = useState();

    useEffect(() => {
        if (chartRef) {
            const myChart = echarts.init(chartRef.current, 'dark');
            setChart(myChart);
        }
    }, [chartRef]);

    useEffect(() => {
        const getData = async () => {
            const res = await fetch("http://127.0.0.1:7878/age_group_summary_report")
            const data = await res.json();
            console.log(data);
            setDataMap(data.data)
        }
        getData();
    }, [])

    useEffect(() => {



        if (chart && dataMap) {
            const xData = dataMap.indicator;
            const all = dataMap.all;
            const male = dataMap.male;
            const female = dataMap.female;
            // y-index,x-index, value
            let data = dataMap.all;
            data = data.map(function (item, index) {
                return [index, index, item];
            });

            console.log(data);


            const option = {

                tooltip: {
                    position: 'top'
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
                    show: true,
                    data: ['All', 'Female', 'Male']
                }
            };
            chart.setOption(option);
        }
    }, [chart, dataMap]);
    return (
        <div ref={chartRef} className="w-auto" style={{ "height": "600px" }} />
    );
}

export default DeathReportAgeGroupHeatMap;