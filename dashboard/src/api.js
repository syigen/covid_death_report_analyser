const DATA = {
    "data": null,
    "created": null
};
const Api = async () => {
    const curTime = new Date();
    const should_refresh = false;
    if (!DATA.data || should_refresh) {
        let url = `${process.env.REACT_APP_API_URL}`
        const res = await fetch(url)
        const data = await res.json();
        DATA.data = data
        DATA.created = curTime;
    }
    return DATA.data;
}
export default Api;