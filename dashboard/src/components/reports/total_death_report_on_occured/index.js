import moment from 'moment';
import React, { useEffect, useState } from 'react';
import echarts from '../../../chart_theme';
import ChartReportCore from '../chart_report_core';

const ActionComponent = ({ onChangeDateRange }) => {
    const [selected, setSelected] = useState(-1);
    useEffect(() => {
        if (onChangeDateRange)
            onChangeDateRange(selected);
    }, [selected, onChangeDateRange]);

    return (
        <>
            <div className={"mb-2"}>
                <span class="text-gray-50 text-xl font-semibold">Daily count based on press release</span>
            </div>
            <div className={"mb-2 w-full sm:w-auto grid grid-cols-2 md:grid-cols-4 gap-1"}>
                <button disabled={selected === -1} className={`py-1 px-3 mx-2 text-gray-50 rounded-md  bg-green-500 hover:bg-green-600 disabled:opacity-50`} onClick={() => setSelected(-1)} >All</button>
                <button disabled={selected === 7} className={`py-1 px-3 mx-2 text-gray-50 rounded-md  bg-green-500 hover:bg-green-600 disabled:opacity-50`} onClick={() => setSelected(7)} >Last 7 Days</button>
                <button disabled={selected === 14} className={`py-1 px-3 mx-2 text-gray-50 rounded-md  bg-green-500 hover:bg-green-600 disabled:opacity-50`} onClick={() => setSelected(14)} >Last 14 Days</button>
                <button disabled={selected === 30} className={`py-1 px-3 mx-2 text-gray-50 rounded-md  bg-green-500 hover:bg-green-600 disabled:opacity-50`} onClick={() => setSelected(30)} >Last 30 Days</button>
            </div>
        </>
    );
}

const TotalDeathOccuredReport = ({ rawData }) => {
    const [chartOption, setChartOption] = useState();
    const [dataMap, setDataMap] = useState();
    const [dateRange, onChangeDateRange] = useState(-1);

    useEffect(() => {
        if (rawData) {
            const data = rawData.daily_summary_report;
            setDataMap(data);
        }
    }, [rawData]);

    useEffect(() => {
        if (dataMap) {
            let dates = [...dataMap.dates];
            const latestDate = dataMap.dates[dataMap.dates.length - 1];
            let seriesLastRecodedDataSet = [...dataMap.data.record_date[latestDate]];
            let seriesLastGenderDataSet = [...dataMap.data.gender[latestDate]];
            if (dateRange && dateRange !== -1) {
                const endDate = moment(latestDate);
                const startDate = moment(latestDate).subtract(dateRange, "days");
                const fDates = dataMap.dates.filter((d) => {
                    const m = moment(d);
                    if (m.isBetween(startDate, endDate))
                        return d;
                    return false;
                });
                const filterFirstDate = fDates[0];
                seriesLastRecodedDataSet = [...seriesLastRecodedDataSet.splice(dates.indexOf(filterFirstDate), seriesLastRecodedDataSet.length)]

                const seriesFirstGenderDataSet = [...dataMap.data.gender[filterFirstDate]];
                console.log(seriesFirstGenderDataSet, seriesLastGenderDataSet);
                let maleCount = 0;
                let femaleCount = 0;

                [...seriesLastGenderDataSet].forEach((elem) => {
                    if (elem.name === "Male")
                        maleCount += elem.value;
                    if (elem.name === "Female")
                        femaleCount += elem.value;
                });


                [...seriesFirstGenderDataSet].forEach((elem) => {
                    if (elem.name === "Male")
                        maleCount -= elem.value;
                    if (elem.name === "Female")
                        femaleCount -= elem.value;
                });

                seriesLastGenderDataSet = [
                    { name: "Male", value: maleCount },
                    { name: "Female", value: femaleCount },
                ]

                dates = [...fDates];
            }

            const timeLineOption = {
                timeline: {
                    show: false,
                    axisType: 'category',
                    // realtime: false,
                    loop: false,
                    autoPlay: true,
                    currentIndex: (dates.length - 1),
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
                }
            }

            const option = {
                ...timeLineOption,
                title: {
                    text: `Up to press release ${latestDate}`,
                    subtext: 'Count by incident date',
                    sublink: "https://www.dgi.gov.lk/news/press-releases-sri-lanka/covid-19-documents",
                    subTarge: "blank"
                },
                tooltip: {
                },
                legend: {
                    bottom: 40,
                    data: ['Count by incident date', 'Cummulative Gender Wise Data'],
                },
                calculable: true,
                grid: {
                    top: 80,
                    bottom: 90,
                    left: 40,
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
                    bottom: 0,
                    textStyle: {
                        color: "#white"
                    }
                }],
                series: [
                    {
                        name: 'Count by incident date',
                        type: 'bar', itemStyle: {
                            color: '#a75252'
                        },
                        markPoint: {
                            data: [
                                {
                                    type: 'max',
                                    // coord: [5, 33.4],
                                    name: 'Max Incidents',
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
                        },
                        markLine: {
                            data: [
                                {
                                    type: 'average', name: 'Average Incidents', itemStyle: {
                                        color: "##FD4098",
                                    },
                                }
                            ]
                        },
                        data: seriesLastRecodedDataSet,
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
                        data: seriesLastGenderDataSet
                    }
                ],
                // options: dateRange === -1 ? dates.map((d) => {
                //     return {
                //         title: { text: `Press Release Date  ${d}` },

                //         series: [
                //             {
                //                 data: dataMap.data.record_date[`${d}`],
                //             },
                //             {
                //                 data: dataMap.data.gender[`${d}`],
                //             }
                //         ]
                //     }
                // }) : []
            };
            setChartOption(option);
        }
    }, [dataMap, dateRange]);
    return (
        <>

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
                    chartOption
                }
                className={
                    "w-full"
                }
                style={
                    {
                        "height": "600px"
                    }
                }
                watermarkPos={{
                    bottom: 95,
                    right: 10
                }}
                actionBarComponent={<ActionComponent onChangeDateRange={onChangeDateRange} />}
            />
        </>
    );
}

export default TotalDeathOccuredReport;