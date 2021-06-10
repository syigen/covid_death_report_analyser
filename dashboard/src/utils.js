import moment from 'moment';
const getNumberWithOrdinal = (n) => {
    var s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
const dateFormatter = (label, monthFormat) => {
    let formatedLabel = label;
    const m = moment(label);
    formatedLabel = m.week() - moment(m).startOf('month').week();
    return m.format(monthFormat) + " " + getNumberWithOrdinal(formatedLabel) + " Week";
}
export {
    getNumberWithOrdinal,
    dateFormatter
}