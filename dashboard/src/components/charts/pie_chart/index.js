import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const PieChartReport = ({ title = "", data = [] }) => {
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
                        name: `${title}`,
                        type: 'pie',
                        avoidLabelOverlap: true,
                        label: {
                            show: false,
                            position: 'left'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
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
    }, [chart, title, data]);
    return (
        <div ref={chartRef} className="w-auto h-full" />
    );
}
export default PieChartReport;