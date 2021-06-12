import React, { useEffect, useState } from 'react';
import ChartReportCore from '../chart_report_core';
import echarts from '../../../chart_theme';

const TotalDeathReport = ({ rawData }) => {
    const [chartOptions, setChartOptions] = useState();
    const [dataMap, setDataMap] = useState();
    useEffect(() => {
        if (rawData) {
            const data = rawData.daily_summary_report;
            setDataMap(data);
        }
    }, [rawData])

    useEffect(() => {
        if (dataMap) {
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
                    subtext: 'COVID-19 Deaths based on SriLanka Goverment publications',
                    padding: [
                        10,  // up
                        10, // left
                    ]
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
                        name: 'Count per day'
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
                        name: 'Publication Date', type: 'line', itemStyle: {
                            color: '#bee3f5'
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
                        title: { text: `Data up to ${d}` },
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
            setChartOptions(option);
        }
    }, [dataMap]);
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
            option={
                chartOptions
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

export default TotalDeathReport;