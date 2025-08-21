const courseNumRegex = /^(\d{1,3})([a-zA-Z]{0,2})$/;

const getCourseNumber = (rawCourseNumber) => {
  return rawCourseNumber.match(courseNumRegex)
    ? rawCourseNumber.match(courseNumRegex)[1]
    : "";
};
const getSuffix = (rawCourseNumber) => {
  return rawCourseNumber.match(courseNumRegex)
    ? rawCourseNumber.match(courseNumRegex)[2].toUpperCase()
    : "";
};
export { getSuffix, getCourseNumber, courseNumRegex };
