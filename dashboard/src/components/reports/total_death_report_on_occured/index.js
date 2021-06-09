import React, { useEffect, useRef, useState } from 'react';
import echarts from '../../../chart_theme';
import InfoPanel from '../../ui/info_ui';
import ChartReportCore from '../chart_report_core';

const TotalDeathOccuredReport = ({ rawData }) => {
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
                    // realtime: false,
                    loop: false,
                    autoPlay: true,
                    currentIndex: parseInt((dates.length - 1) * 7 / 8),
                    playInterval: 500,
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
                    padding: [
                        10,  // up
                        10, // left
                    ],
                    subtext: 'This report is calculate each day based on official press release',
                    sublink: "https://www.dgi.gov.lk/news/press-releases-sri-lanka/covid-19-documents",
                    subTarge: "blank"
                },
                tooltip: {
                },
                legend: {
                    data: ['Reported Count', 'Recorded Count'],
                },
                calculable: true,
                graphic: [
                    {
                        type: 'group',
                        right: 50,
                        bottom: 120,
                        z: 100,
                        children: [
                            {
                                type: 'rect',
                                left: "center",
                                top: 'center',
                                z: 100,
                                shape: {
                                    width: 200,
                                    height: 30
                                },
                                style: {
                                    fill: 'rgba(0,0,0,0.1)'
                                }
                            },
                            {
                                type: 'text',
                                left: "center",
                                top: 'center',
                                z: 100,
                                style: {
                                    fill: 'rgba(255,255,255,0.4)',
                                    text: 'pandemic-info.syigen.com',
                                }
                            }
                        ]
                    },
                ],
                grid: {
                    top: 80,
                    bottom: 120,
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
                dataZoom: [{
                    bottom: 60,
                    textStyle: {
                        color: "#white"
                    }
                }],
                series: [
                    {
                        name: 'Incident Date', type: 'bar', itemStyle: {
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
                                }
                            ],
                            legend: {
                                data: ['Reported Count', 'Recorded Count'],
                            },
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
                        name: 'Cummulative Gender Wise Data',
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
                                },
                                color: (item) => {

                                    let colorStops = [];

                                    if (item.name === "Male") {
                                        colorStops = [
                                            { offset: 0, color: 'rgba(55, 162, 255)' },
                                            { offset: 1, color: 'rgba(116, 21, 219)' }
                                        ]
                                    } else if (item.name === "Female") {
                                        colorStops = [
                                            { offset: 0, color: 'rgba(255, 0, 135)' },
                                            { offset: 1, color: 'rgba(135, 0, 157)' }
                                        ]
                                    }

                                    return {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: colorStops
                                    }
                                },
                            },

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
                        title: { text: `Press Release Date  ${d}` },


                        series: [
                            {
                                data: dataMap.data.record_date[`${d}`],
                            },
                            {
                                data: dataMap.data.gender[`${d}`],
                            }
                        ]
                    }
                })
            };
            chart.setOption(option);
        }
    }, [chart, dataMap]);
    return (
        <ChartReportCore
            sinhalaText={
                <>
                    මරණය සිදුවූ දවස අනුව එකතුව මෙම Bar Chart එක මගින් පෙන්වා ඇත. මෙහි දැක්වෙන අගයන් එම
                    දිනට අදාලව දැනට නිකුත් වී ඇති වාර්තා පදනම් කරගෙන
                    නිර්මාණය කර ඇති නිසා මෙහි දක්වා ඇති දිනයන්ට අදාල  අගයන් ඉදිරියේදි ලැබෙන වාර්තා අනුව වෙනස් විය හැක
                </>
            }
            englishText={
                <>
                    This chart shows sum of death per day. These values are based on data currently released to public.
                    This is subject to change upon availability of new data.
                </>
            }
            chartRef={
                chartRef
            }
            className={
                "w-full"
            }
            style={
                {
                    "height": "600px"
                }
            }
        />
    );
}

export default TotalDeathOccuredReport;