import React, { useState, useEffect, useRef } from 'react';
import Api from '../../../api';
import echarts from '../../../chart_theme';

const TotalDeathReport = ({ title = "", data = [] }) => {
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
            const data = data_raw.daily_summary_report;
            setDataMap(data)
        }
        getData();
    }, [])

    useEffect(() => {
        if (chart && dataMap) {
            const dates = dataMap.dates;
            const option = {
                timeline: {
                    axisType: 'category',
                    // realtime: false,
                    loop: false,
                    autoPlay: true,
                    currentIndex: dates.length - 1,
                    playInterval: 100,
                    controlStyle: {
                        position: 'left'
                    },
                    data: dates,
                    label: {
                        formatter: function (s) {
                            // (new Date(s))
                            return s;//.getDay();
                        }
                    }
                },
                title: {
                    subtext: 'COVID-19 Death Analysis'
                },
                tooltip: {
                },
                legend: {
                    left: 'right',
                    data: ['Reported Count', 'Recorded Count'],
                    selected: {

                    }
                },
                calculable: true,
                grid: {
                    top: 80,
                    bottom: 80,
                    left: 30,
                    right: 30,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true,
                                formatter: function (params) {
                                    return params.value.replace('\n', '');
                                }
                            }
                        }
                    }
                },
                xAxis: [
                    {
                        'type': 'category',
                        'data': dates,
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'Count'
                    }
                ],
                series: [
                    { name: 'Publication Date', type: 'line' },
                    { name: 'Publication Date & Occured Date', type: 'bar' },
                    { name: 'Occured Date', type: 'bar' },
                    {
                        name: 'Gender',
                        type: 'pie',
                        center: ['20%', '40%'],
                        radius: '30%',
                        z: 100
                    }
                ],
                options: dates.map((d) => {
                    return {
                        title: { text: `${d}` },
                        series: [
                            { data: dataMap.data.report_date_count[`${d}`] },
                            { data: dataMap.data.report_date[`${d}`] },
                            { data: dataMap.data.record_date[`${d}`] },
                            {
                                data: dataMap.data.gender[`${d}`]
                            }
                        ]
                    }
                })
            };
            chart.setOption(option);
        }
    }, [chart, dataMap]);
    return (
        <div ref={chartRef} className="w-full" style={{ "height": "600px" }} />
    );
}

export default TotalDeathReport;