import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const HistogramReport = ({ title = "", x = [], y = [] }) => {
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
            chart.setOption({
                title: {
                    text: `${title}`
                },
                tooltip: {},
                xAxis: {
                    data: x
                },
                yAxis: {},
                series: [{
                    name: 'sales',
                    type: 'bar',
                    data: y
                }]
            });
        }
    }, [chart, title, x, y]);
    return (
        <div ref={chartRef} className="w-auto h-full" />
    );
}
export default HistogramReport;