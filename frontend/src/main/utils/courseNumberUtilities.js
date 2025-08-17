

const regex= /^(\d+)([a-zA-Z]{0,2})$/;

const getCourseNumber = (rawCourseNumber) => {
    return rawCourseNumber.match(regex)
        ? rawCourseNumber.match(regex)[1]
        : "";
}
const getSuffix = (rawCourseNumber) => {
    return rawCourseNumber.match(regex)
        ? rawCourseNumber.match(regex)[2].toUpperCase()
        : "";
}
export { getSuffix, getCourseNumber };
