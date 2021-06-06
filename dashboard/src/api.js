const DATA = {
    "data": null,
    "created": null
};
const Api = async () => {
    const curTime = new Date();

    // curTime.

    const should_refresh = false;
    if (!DATA.data || should_refresh) {
        const res = await fetch("https://covid-srilanak-deathreports.s3.amazonaws.com/get_json_report.json")
        const data = await res.json();
        DATA.data = data
        DATA.created = curTime;
    }
    return DATA.data;
}
export default Api;