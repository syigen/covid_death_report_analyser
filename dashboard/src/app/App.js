import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import './App.css';

const App = () => {
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
                    text: 'ECharts Getting Started Example'
                },
                tooltip: {},
                xAxis: {
                    data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks']
                },
                yAxis: {},
                series: [{
                    name: 'sales',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            });
        }
    }, [chart]);


    return (
        <div className="App">
            <div ref={chartRef} className="w-auto h-48" />
        </div>
    );
}

export default App;
