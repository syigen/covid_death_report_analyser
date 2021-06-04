import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const PieChartReport = ({ title = "", x = [], y = [] }) => {
    const chartRef = useRef();
    const [chart, setChart] = useState();

    useEffect(() => {
        if (chartRef) {
            const myChart = echarts.init(chartRef.current, 'dark');
            setChart(myChart);
        }
    }, [chartRef]);

    useEffect(() => {
        if (chart) {
            const option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: 'Gender',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 1048, name: 'Male' },
                            { value: 735, name: 'Female' },
                        ]
                    }
                ]
            };
            chart.setOption(option);
        }
    }, [chart, title, x, y]);
    return (
        <div ref={chartRef} className="w-auto h-full" />
    );
}
export default PieChartReport;