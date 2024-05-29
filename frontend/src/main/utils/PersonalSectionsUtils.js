import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
  console.log(message);
  toast(message);
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/courses/use/psid",
    method: "DELETE",
    params: {
      psId: cell.row.values.psId,
      enrollCd: cell.row.values.enrollCd
    },
  };
}
