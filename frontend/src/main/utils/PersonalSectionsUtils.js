import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
  console.log(message);
  toast(message);
}

export function cellToAxiosParamsDelete(enrollCd, psId) {
  return {
    url: "/api/courses/user/psid",
    method: "DELETE",
    params: {
      enrollCd: enrollCd,
      psId: psId
    },
  };
}
