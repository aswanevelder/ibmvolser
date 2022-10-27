//Dates are stored as julian dates yyy/ddd
exports.convertJulianDay = (jd) => {
    const array = jd.split("/");
    if (array.length == 2) {
        const date = new Date(array[0], 0, array[1]);
        return date.toDateString();
    }
    else
        return jd;
}