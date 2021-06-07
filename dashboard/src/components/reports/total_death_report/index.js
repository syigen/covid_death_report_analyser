import React, { useEffect, useRef, useState } from 'react';
import echarts from '../../../chart_theme';

const TotalDeathReport = ({ rawData }) => {
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
            const data = rawData.daily_summary_report;
            setDataMap(data);
        }
    }, [rawData])

    useEffect(() => {
        if (chart && dataMap) {
            const dates = dataMap.dates;
            const option = {
                timeline: {
                    axisType: 'category',
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
                            return s;
                        }
                    }
                },
                title: {
                    subtext: 'COVID-19 Death Announced Date'
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
                    {
                        name: 'Publication Date', type: 'line', itemStyle: {
                            color: '#a75252'
                        },
                        markPoint: {
                            data: [
                                {
                                    type: 'max', name: 'Max Incidents',
                                    itemStyle: {
                                        color: "#FD4040",
                                    },
                                    label: {
                                        textStyle: {
                                            color: '#fff'
                                        }
                                    }
                                },
                                {
                                    type: 'min', name: 'Min Incidents', itemStyle: {
                                        color: "#4072FD",
                                    },
                                    label: {
                                        textStyle: {
                                            color: '#fff'
                                        }
                                    }
                                }
                            ]
                        },
                        markLine: {
                            data: [
                                {
                                    type: 'average', name: 'Average Incidents', itemStyle: {
                                        color: "##FD4098",
                                    },
                                }
                            ]
                        }
                    },
                    {
                        name: 'Incident Date', type: 'bar', itemStyle: {
                            color: '#a75252'
                        },
                    },
                    {
                        name: 'Gender',
                        type: 'pie',
                        center: ['20%', '40%'],
                        radius: '30%',
                        z: 100,
                        color: ["#bee3f5", "#fcc3c3"],
                        itemStyle: {
                            borderColor: '#293441',
                            borderWidth: 4,
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
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    position: 'center',
                                    textStyle: {
                                        fontWeight: 'bold'
                                    }
                                }
                            }
                        },
                    }
                ],
                options: dates.map((d) => {
                    return {
                        title: { text: `${d}` },
                        series: [
                            { data: dataMap.data.report_date_count[`${d}`] },
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