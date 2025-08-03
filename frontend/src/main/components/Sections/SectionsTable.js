import SectionsTableBase from "main/components/SectionsTableBase";

import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import { useCurrentUser } from "main/utils/currentUser.js";

import {
  formatDays,
  formatInstructors,
  formatLocation,
  formatTime,
  formatStatus,
  enrollmentFraction,
  getSection,
  getSectionField,
  renderInfoLink,
  shouldShowAddToScheduleLink,
  getQuarter,
} from "main/utils/sectionUtils.js";
import { yyyyqToQyy } from "main/utils/quarterUtilities";
import AddToScheduleModal from "main/components/PersonalSchedules/AddToScheduleModal";

export const objectToAxiosParams = (data) => {
  return {
    url: "/api/courses/post",
    method: "POST",
    params: {
      enrollCd: data.enrollCd.toString(),
      psId: data.psId.toString(),
    },
  };
};

export const onSuccess = (response) => {
  if (response.length < 3) {
    toast(
      `New course Created - id: ${response[0].id} enrollCd: ${response[0].enrollCd}`,
    );
  } else {
    toast(
      `Course ${response[0].enrollCd} replaced old section ${response[2].enrollCd} with new section ${response[1].enrollCd}`,
    );
  }
};

export const onError = (error) => {
  console.error("onError: error=", error);
  const message =
    error.response.data?.message || `An unexpected error occurred adding the schedule: ${JSON.stringify(error)}`;
  toast.error(message);
};

export default function SectionsTable({ sections, schedules = [] }) {

  if ( ! (schedules instanceof Array) ) {
    throw new Error("schedules prop must be an array");
  }

  if ( schedules.length > 0 && ! (schedules[0].hasOwnProperty("id")) ) {
    throw new Error("schedules prop must be an array of objects with an 'id' property");
  }

  const { data: currentUser } = useCurrentUser();
  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess, onError },
    [],
  );

  const addToScheduleCallback = (section, schedule, mutation) => {
    const dataFinal = {
      enrollCd: section.enrollCode,
      psId: schedule,
    };
    mutation.mutate(dataFinal);
  };

  const testid = "SectionsTable";

  const columns = [
    {
      id: "expander", // Unique ID for the expander column
      header: ({ table }) => (
        <button
          data-testid={`${testid}-expand-all-rows`}
          {...{
            onClick: table.getToggleAllRowsExpandedHandler(),
          }}
        >
          {table.getIsAllRowsExpanded() ? "➖" : "➕"}
        </button>
      ),
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <button
            data-testid={`${testid}-row-${row.index}-expand-button`}
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: "pointer" },
            }}
          >
            {row.getIsExpanded() ? "➖" : "➕"}
          </button>
        ) : (
          <span data-testid={`${testid}-row-${row.index}-cannot-expand`} />
        ),
      // This is important for indenting sub-rows
      // We'll apply this style in the render, but you can define it here too
      // For sub-rows, you might want to adjust cell content for clarity
    },
    {
      header: "Quarter",
      accessorKey: "quarter",
      cell: ({ row }) =>
        row.original.quarter ? yyyyqToQyy(row.original.quarter) : "",
    },
    {
      accessorKey: "courseId",
      header: "Course ID",
      // cell: ({ row, getValue }) => (
      //   <div style={{ paddingLeft: `${row.depth * 2}rem` }}>{getValue()}</div>
      // ),
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => formatStatus(getSection(row)),
    },
    {
      header: "Enrolled",
      accessorKey: "enrolled",
      cell: ({ row }) => enrollmentFraction(row),
    },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => formatLocation(getSection(row).timeLocations),
    },
    {
      id: "days",
      header: "Days",
      cell: ({ row }) => formatDays(getSection(row).timeLocations),
    },
    {
      id: "time",
      header: "Time",
      cell: ({ row }) => formatTime(getSection(row).timeLocations),
    },
    {
      id: "instructor",
      header: "Instructor",
      cell: ({ row }) => formatInstructors(getSection(row).instructors),
    },
    {
      accessorKey: "enrollCode",
      header: "Enroll Code",
      cell: ({ row }) => getSectionField(row, "enrollCode"),
    },
    {
      header: "Info",
      id: "info",
      cell: ({ row }) => renderInfoLink(row, testid),
    },
    {
      header: "Action",
      id: "action",
      cell: ({ row }) => {
        if (!currentUser.loggedIn) {
          return <span data-testid={`${testid}-row-${row.id}-not-logged-in`} />;
        } else if (!shouldShowAddToScheduleLink(row)) {
          return <span data-testid={`${testid}-row-${row.id}-no-action`} />;
        }
        return (
          <div className="d-flex align-items-center gap-2">
            <AddToScheduleModal
              section={getSection(row)}
              quarter={getQuarter(row)}
              onAdd={(section, schedule) =>
                addToScheduleCallback(section, schedule, mutation)
              }
              schedules={schedules}
              testid={`${testid}-cell-row-${row.id}-col-action`}
            />
          </div>
        );
      },
    }
  ];

  return (
    <>
      <SectionsTableBase columns={columns} data={sections} testid={testid} />
    </>
  );
}
