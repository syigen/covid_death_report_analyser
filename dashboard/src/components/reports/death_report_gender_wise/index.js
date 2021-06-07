import { useEffect, useState } from "react";
import PieChartReport from "../../charts/pie_chart";

const DeathReportGenderWise = ({rawData}) => {
    const [genderCount, setGenderCount] = useState();
    useEffect(() => {
        setGenderCount([
            { value: 1048, name: 'Male' },
            { value: 735, name: 'Female' },
        ])
    }, [])

    


    return (
        <PieChartReport title={"Gender wise deaths"} data={genderCount} />
    );
}

export default DeathReportGenderWise;