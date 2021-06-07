const DATA = {
    "data": null,
    "created": null
};
const Api = async () => {
    const curTime = new Date();
    const should_refresh = false;
    if (!DATA.data || should_refresh) {
        // const res = await fetch("https://pandemic-info.s3.amazonaws.com/get_json_report.json")
        const res = await fetch("http://127.0.0.1:7878/get_json_report")
        const data = await res.json();
        DATA.data = data
        DATA.created = curTime;
    }
    return DATA.data;
}
export default Api;