const DATA = {
    "data": null,
    "created": null
};
const Api = async () => {
    const curTime = new Date();
    const should_refresh = false;
    if (!DATA.data || should_refresh) {
        let url = "./get_json_report.json"
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            url = "http://127.0.0.1:7878/get_json_report"
        }
        const res = await fetch(url)
        const data = await res.json();
        DATA.data = data
        DATA.created = curTime;
    }
    return DATA.data;
}
export default Api;