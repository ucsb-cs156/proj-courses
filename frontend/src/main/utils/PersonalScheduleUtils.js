import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
  console.log(message);
  toast(message);
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/personalschedules",
    method: "DELETE",
    params: {
      id: cell.row.original.id,
    },
  };
}

export function schedulesFilter(schedules, quarter) {
  return schedules.filter((schedule) => schedule.quarter === quarter);
}
