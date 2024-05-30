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
      id: cell.row.values.id,
    },
  };
}

export function filterSchedulesByQuarter(schedules, quarter) {
  return schedules.filter((schedule) => schedule.quarter === quarter);
}
