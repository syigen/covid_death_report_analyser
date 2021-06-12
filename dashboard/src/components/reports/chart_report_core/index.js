import { useEffect, useRef, useState } from "react";
import echarts from '../../../chart_theme';
import InfoPanel from "../../ui/info_ui";

const ChartReportCore = ({ sinhalaText, englishText, option, style = {}, className = "" }) => {

    const chartRef = useRef();
    const [chart, setChart] = useState();

    useEffect(() => {
        if (chartRef) {
            const myChart = echarts.init(chartRef.current, 'chalk');
            setChart(myChart);
        }
    }, [chartRef]);

    useEffect(() => {
        if (option && chart)
            chart.setOption(option);
    }, [chart, option]);

    return (
        <div class="p-2 bg-chart rounded-md w-full " style={{
            "height": "100%"
        }}>
            <InfoPanel
                sinhala={sinhalaText}
                english={englishText}
            />
            <div ref={chartRef} className={"h-full w-full"} style={{ "height": "30rem", ...style }} />
        </ div>
    );
}

export default ChartReportCore;