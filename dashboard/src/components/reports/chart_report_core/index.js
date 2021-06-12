import { useEffect, useRef, useState } from "react";
import echarts from '../../../chart_theme';
import InfoPanel from "../../ui/info_ui";

const ChartReportCore = ({ sinhalaText, englishText, option, style = {}, className = "", actionBarComponent, watermarkPos = {
    bottom: 10,
    right: 10
} }) => {
    const chartRef = useRef();
    const [chart, setChart] = useState();
    const [ActionBarComponent, setActionBarComponent] = useState()


    useEffect(() => {
        if (actionBarComponent) {
            setActionBarComponent(actionBarComponent)
        }
    }, [actionBarComponent]);

    useEffect(() => {
        if (chartRef) {
            const myChart = echarts.init(chartRef.current, 'chalk');
            myChart.showLoading({
                textColor: "#fff",
                maskColor: 'rgba(255, 255, 255, 0.0)',
            });
            setChart(myChart);
            return () => {
                myChart.dispose();
            }
        }
    }, [chartRef]);

    useEffect(() => {
        if (option && chart) {
            chart.hideLoading();
            const graphic = [
                {
                    type: 'group',
                    right: watermarkPos.right,
                    bottom: watermarkPos.bottom,
                    top: watermarkPos.top,
                    left: watermarkPos.left,
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
            ];

            chart.setOption({
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: { readOnly: false },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                "graphic": graphic, ...option
            });
        }
    }, [chart, option, watermarkPos]);

    return (
        <div class="p-2 bg-chart rounded-md w-full " style={{
            "height": "100%"
        }}>
            {ActionBarComponent &&
                <div class="mt-2 flex justify-between space-x-4 w-full mb-2 border-b border-gray-50 border-opacity-10">
                    {ActionBarComponent}
                </div>
            }
            <div ref={chartRef} className={"h-full w-full"} style={{ "height": "30rem", ...style }} />
            <InfoPanel
                sinhala={sinhalaText}
                english={englishText}
            />

        </ div>
    );
}

export default ChartReportCore;