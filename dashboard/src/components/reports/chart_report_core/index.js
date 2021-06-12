import { SaveIcon } from "@heroicons/react/solid";
import { useEffect, useRef, useState } from "react";
import echarts from '../../../chart_theme';
import InfoPanel from "../../ui/info_ui";

const ChartReportCore = ({ sinhalaText, englishText, option, style = {}, className = "", actionBarComponent = <></> }) => {

    const chartRef = useRef();
    const [chart, setChart] = useState();
    const [chartDataImage, setChartDataImage] = useState();

    useEffect(() => {
        if (chartDataImage) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = chartDataImage;
            img.onload = () => {
                // create Canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                // create a tag
                const a = document.createElement('a');
                const chartName = chart.getOption().title[0].text;
                console.log(chart.getOption());
                a.download = `${chartName}.png`;
                a.href = canvas.toDataURL('image/png');
                a.click();
            };
        }
    }, [chartDataImage, chart]);

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
                    right: 10,
                    bottom: 10,
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

            chart.setOption({ "graphic": graphic, ...option });
        }
    }, [chart, option]);

    return (
        <div class="p-2 bg-chart rounded-md w-full " style={{
            "height": "100%"
        }}>
            <div class="mt-2 flex space-x-4 w-full">
                <section class="flex-initial">
                    {{ actionBarComponent }}
                </section>
                <section class="flex-initial ">
                    <button
                        class="text-gray-100 font-bold py-2 px-4 inline-flex items-center"
                        onClick={() => {
                            if (chart) {
                                setChartDataImage(
                                    chart.getDataURL({
                                        pixelRatio: 2,
                                    })
                                );
                            }
                        }}
                    >
                        <SaveIcon className={"w-4 h-4 mr-2"} />
                        Save Image
                    </button>
                </section>
            </div>
            <div ref={chartRef} className={"h-full w-full"} style={{ "height": "30rem", ...style }} />
            <InfoPanel
                sinhala={sinhalaText}
                english={englishText}
            />

        </ div>
    );
}

export default ChartReportCore;