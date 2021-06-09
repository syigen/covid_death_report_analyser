import InfoPanel from "../../ui/info_ui";

const ChartReportCore = ({ sinhalaText, englishText, chartRef }) => {

    return (
        <div class="p-2 h-auto bg-chart rounded-md">
            <InfoPanel
                sinhala={sinhalaText}
                english={englishText}
            />
            <div ref={chartRef} className="w-full" style={{ "height": "600px" }} />
        </ div>
    );
}

export default ChartReportCore;