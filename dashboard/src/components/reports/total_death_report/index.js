import React, { forwardRef, useEffect, useState } from 'react';
import ChartReportCore from '../chart_report_core';
import echarts from '../../../chart_theme';
import ReactDatePicker from 'react-datepicker';
import moment from 'moment';

const ActionBarComponent = ({ onChangeStartDate, onChangeEndDate }) => {
    const [startDate, setStartDate] = useState(new Date())
    // const [endDate, setEndDate] = useState(new Date().setDate(startDate.getDay() + 7))
    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className="py-2 px-4 bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-md text-gray-50" onClick={onClick} ref={ref}>
            Pres release date  {value}
        </button>
    ));
    return (
        <>
            <div className={"mb-2"}>
                <span class="text-gray-50 text-xl font-semibold">Daily count based on press release</span>
            </div>
            <div className={"mb-2"}>
                <ReactDatePicker
                    selected={startDate}
                    onChange={(date) => { setStartDate(date); if (onChangeStartDate) onChangeStartDate(moment(date).format("YYYY-MM-DD")) }}
                    selectsStart
                    customInput={<ExampleCustomInput />}
                    nextMonthButtonLabel=">"
                    previousMonthButtonLabel="<"
                />
            </div>
        </>
    )
}
const TotalDeathReport = ({ rawData }) => {
    const [chartOptions, setChartOptions] = useState();
    const [dataMap, setDataMap] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [filterData, setFilterData] = useState([]);
    useEffect(() => {
        if (rawData) {
            const data = rawData.daily_summary_report;
            setDataMap(data);
        }
    }, [rawData]);


    useEffect(() => {

        if (dataMap) {
            const startDateVal = moment(startDate);
            const endDateVal = moment(endDate ? endDate : startDate);
            const dates = [...dataMap.dates.filter(
                (d) => {
                    const m = moment(d);
                    if (m.isBetween(startDateVal, endDateVal) || m.isSame(startDate) || m.isSame(endDate)) {
                        return d;
                    }
                    return false;
                }
            )];

            if (dates && dates.length > 0) {
                let filters = null;
                dates.map((d) => {
                    const data = dataMap.data.selected_date[`${d}`];
                    if (!data) {
                        return [];
                    }
                    return [...data];
                }).forEach((ar) => {
                    if (!filters) {
                        filters = ar;
                    } else {
                        for (let i = 0; i < ar.length; i++) {
                            const c = ar[i];
                            filters[i] += c;
                        }
                    }
                });
                setFilterData(filters);
            }
        }

    }, [startDate, endDate, dataMap]);

    useEffect(() => {
        if (dataMap) {
            const dates = dataMap.dates;
            const option = {
                timeline: {
                    bottom: 0,
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
                    top: 70,
                    data: ['Selected anncounded date distribution', 'Count by announced date', 'Count by incident date', 'Cummulative Gender Wise Data'],
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
                series: [{
                    type: 'bar',
                    barGap: '-100%',  // this changed
                    zlevel: 100,
                    name: 'Selected anncounded date distribution', itemStyle: {
                        color: 'rgba(59, 130, 246, 0.5)'
                    },
                    data: filterData,
                    markPoint: {
                        data: [
                            {
                                type: 'max',
                                name: 'Max Incidents',
                                itemStyle: {
                                    color: "rgba(59, 130, 246, 0.9)",
                                },
                                label: {
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            }
                        ],
                    },
                },
                {
                    name: 'Count by announced date', type: 'line', itemStyle: {
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
                    name: 'Count by incident date', type: 'bar', itemStyle: {
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
                            {
                                data: filterData
                            },
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
    }, [dataMap, filterData]);
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
            watermarkPos={
                {
                    bottom: 140,
                    right: 10
                }
            }
            actionBarComponent={<>
                <ActionBarComponent
                    onChangeStartDate={setStartDate}
                    onChangeEndDate={setEndDate} />
            </>}
        />
    );
}

export default TotalDeathReport;