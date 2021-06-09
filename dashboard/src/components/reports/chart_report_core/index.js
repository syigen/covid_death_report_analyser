import InfoPanel from "../../ui/info_ui";

const ChartReportCore = ({ sinhalaText, englishText, chartRef, style = {}, className = "" }) => {

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