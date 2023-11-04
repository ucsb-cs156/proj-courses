import { toast } from "react-toastify";
export function onDeleteSuccess(message) {
  console.log(message);
  toast(message);
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/UCSBSubjects",
    method: "DELETE",
    params: {
      subjectCode: cell.row.values.subjectCode,
    },
  };
}
