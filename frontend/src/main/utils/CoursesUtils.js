import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
  console.log(message);
  toast(message);
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/courses/user",
    method: "DELETE",
    params: {
      id: cell.row.values.id,
    },
  };
}

// Example: courseId="CMPSC     130A     " => { subjectArea: "CMPSC", courseNumber: "130A" }
export function parseCourseId(courseId) {
  const splitCourseId = courseId.split(" ").filter((x) => x.length > 0);
  return {
    subjectArea: splitCourseId[0],
    courseNumber: splitCourseId[1],
  };
}
