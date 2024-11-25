import SectionsTableBase from "main/components/SectionsTableBase";
import AddToScheduleModal from "main/components/PersonalSchedules/AddToScheduleModal";

import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import { useCurrentUser } from "main/utils/currentUser.js";

import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
import {
  convertToFraction,
  formatDays,
  formatInstructors,
  formatLocation,
  formatTime,
  isSection,
  formatStatus,
  formatInfoLink,
  renderInfoLink,
} from "main/utils/sectionUtils.js";

function getFirstVal(values) {
  return values[0];
}

export function isLectureWithNoSections(enrollCode, sections) {
  // Find the section with the given enrollCode
  const section = sections.find(
    (section) => section.section.enrollCode === enrollCode,
  );

  if (section) {
    // Extract the courseId and section number from the found section
    const courseId = section.courseInfo.courseId;
    const sectionNumber = section.section.section;
    const courseSections = sections.filter(
      (section) => section.courseInfo.courseId === courseId,
    );
    const timeLocations = section.section.timeLocations;

    // Check if the section number is '0100', indicating a lecture
    if (sectionNumber === "0100") {
      // Filter all sections with the same courseId
      // Stryker disable all
      // Stryker restore all
      // Check if there is only one section for the course
      return courseSections.length === 1;
    } else if (sectionNumber.slice(-2) === "00") {
      // Check if the section has a location to make sure its a course
      return (
        courseSections.length === 1 &&
        typeof timeLocations !== "undefined" &&
        timeLocations.length === 1
      );
    }
  }

  return false;
}
export function isLectureWithSections(enrollCode, sections) {
  // Find the section with the given enrollCode
  const section = sections.find(
    (section) => section.section.enrollCode === enrollCode,
  );

  if (section) {
    // Extract the courseId and section number from the found section
    const courseId = section.courseInfo.courseId;
    const sectionNumberEnd = section.section.section.slice(2);

    if (sectionNumberEnd === "00") {
      // Filter all sections with the same courseId
      // Stryker disable all
      const courseSections = sections.filter(
        (section) => section.courseInfo.courseId === courseId,
      );
      // Stryker restore all
      // Check if there is only one section for the course
      return courseSections.length > 1;
    }
  }

  return false;
}

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

export const handleAddToSchedule = (section, schedule, mutation) => {
  // Execute the mutation with the provided data
  const dataFinal = {
    enrollCd: section.section.enrollCode,
    psId: schedule,
  };
  mutation.mutate(dataFinal);
};

export const handleLectureAddToSchedule = (section, schedule, mutation) => {
  // Execute the mutation with the provided data
  console.log(section);
  const dataFinal = {
    enrollCd: section,
    psId: schedule,
  };
  console.log(dataFinal);
  mutation.mutate(dataFinal);
};

export const onSuccess = (response) => {
  toast(
    `New course Created - id: ${response[0].id} enrollCd: ${response[0].enrollCd}`,
  );
};

const onError = (error) => {
  toast(`Error: ${error.response.data.message}`);
};

export default function SectionsTable({ sections }) {
  // Stryker restore all
  // Stryker disable BooleanLiteral
  const { data: currentUser } = useCurrentUser();

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess, onError },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/courses/user/all"],
  );

  const columns = [
    {
      Header: "Quarter",
      accessor: (row) => yyyyqToQyy(row.courseInfo.quarter),
      disableGroupBy: true,
      id: "quarter",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Course ID",
      accessor: "courseInfo.courseId",

      Cell: ({ cell: { value } }) => value.substring(0, value.length - 2),
    },
    {
      Header: "Title",
      accessor: "courseInfo.title",
      disableGroupBy: true,

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
      Header: "Is Section?",
      accessor: (row) => isSection(row.section.section),
      // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
      id: "isSection",
    },
    {
      Header: "Status",
      accessor: (row) => formatStatus(row.section),
      disableGroupBy: true,
      id: "status",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Enrolled",
      accessor: (row) =>
        convertToFraction(row.section.enrolledTotal, row.section.maxEnroll),
      disableGroupBy: true,
      id: "enrolled",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Location",
      accessor: (row) => formatLocation(row.section.timeLocations),
      disableGroupBy: true,
      id: "location",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Days",
      accessor: (row) => formatDays(row.section.timeLocations),
      disableGroupBy: true,
      id: "days",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Time",
      accessor: (row) => formatTime(row.section.timeLocations),
      disableGroupBy: true,
      id: "time",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Instructor",
      accessor: (row) => formatInstructors(row.section.instructors),
      disableGroupBy: true,
      id: "instructor",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Enroll Code",
      accessor: "section.enrollCode",
      disableGroupBy: true,
      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Info",
      accessor: formatInfoLink,
      Cell: renderInfoLink,
      disableGroupBy: true,
      id: "info",

      aggregate: getFirstVal,
      Aggregated: renderInfoLink,
    },
    // Stryker disable all : difficult to test modal interaction but we should try in future work
    {
      Header: "Action",
      id: "action",
      accessor: "section.enrollCode",
      disableGroupBy: true,
      // No need for accessor if it's purely for actions like expand/collapse
      // Stryker disable all : difficult to test modal interaction
      Cell: ({ row }) => {
        /* istanbul ignore next : difficult to test modal interaction*/
        if (isSection(row.original.section.section) && currentUser.loggedIn) {
          return (
            <div className="d-flex align-items-center gap-2">
              <AddToScheduleModal
                section={row.original}
                quarter={row.original.courseInfo.quarter}
                onAdd={(section, schedule) =>
                  handleAddToSchedule(section, schedule, mutation)
                }
              />
            </div>
          );
        } else {
          return null;
        }
      },
      aggregate: getFirstVal,
      Aggregated: ({ cell: { value }, row }) => /* istanbul ignore next */ {
        const testId = `${testid}-cell-row-${row.index}-col-${value}-expand-symbols`;
        if (isLectureWithNoSections(value, sections) && currentUser.loggedIn) {
          return (
            <div className="d-flex align-items-center gap-2">
              <AddToScheduleModal
                section={value}
                quarter={sections[0].courseInfo.quarter}
                onAdd={(section, schedule) =>
                  handleLectureAddToSchedule(section, schedule, mutation)
                }
              />
            </div>
          );
        } else if (!isLectureWithSections(value, sections)) {
          return null;
        } else {
          return (
            <span {...row.getToggleRowExpandedProps()} data-testid={testId}>
              {row.isExpanded ? "➖" : "➕"}
            </span>
          );
        }
      },
    },
  ];

  // Stryker enable all

  const testid = "SectionsTable";

  const columnsToDisplay = columns;

  return (
    <SectionsTableBase
      data={sections}
      columns={columnsToDisplay}
      testid={testid}
    />
  );
}
