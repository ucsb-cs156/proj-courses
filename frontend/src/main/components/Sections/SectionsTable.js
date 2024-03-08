import SectionsTableBase from "main/components/SectionsTableBase";
import AddToScheduleModal from 'main/components/PersonalSchedules/AddToScheduleModal';

import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

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

export default function SectionsTable({ sections }) {
  // Stryker restore all
  // Stryker disable BooleanLiteral

  // const objectToAxiosParams = (sectionCode, schedule) => {
  //   // Check if sectionCode or schedule is undefined and handle it accordingly
  //   if (typeof sectionCode === 'undefined' || typeof schedule === 'undefined') {
  //     console.error('objectToAxiosParams was called with undefined sectionCode or schedule');
  //     // Optionally, return a default object or handle this error appropriately
  //     return {
  //       url: "/api/courses/post",
  //       method: "POST",
  //       params: {}, // Empty params or some default value if appropriate
  //     };
  //   }
  
  //   return {
  //     url: "/api/courses/post",
  //     method: "POST",
  //     params: {
  //       enrollCd: sectionCode.toString(),
  //       psId: schedule.toString(),
  //     },
  //   };
  // };
  
  const onSuccess = (response) => {
    // Assuming the response contains the course information directly
    toast(`Course with enroll code ${response.id} added to personal schedule with id ${response.enrollCd}`);
  };

  const mutation = useBackendMutation(
    () => ({
      url: "/api/courses/post",
      method: "POST",
      params: {
        enrollCd: "00885",
        psId: "16",
      },
    }),
    { onSuccess },
    ["/api/courses/user/all"]
  );

  // const mutation = useBackendMutation(
  //   objectToAxiosParams,
  //   { onSuccess },
  //   // Stryker disable next-line all : hard to set up test for caching
  //   ["/api/courses/user/all"],
  // );
  
  const handleAddToSchedule = (section, schedule) => {
    // Log statements for debugging, consider removing in production
    console.log("Section Enroll Code:", section.section.enrollCode);
    console.log("Schedule ID:", schedule);
  
    // Prepare the data for mutation
    // Directly using the section and schedule without Object.assign as they are not objects to merge but values to be used
    // const mutation = useBackendMutation(() => objectToAxiosParams(section.section.enrollCode, schedule), { onSuccess });
  
    // Execute the mutation with the provided data
    if (section.section.enrollCode && schedule) {
      const dataFinal = {
        enrollCd: '00885',
        psId: '16',
        // enrollCd: section.section.enrollCode ? section.section.enrollCode.toString() : '00885',
        // psId: schedule ? schedule.toString() : '16',
      };
      mutation.mutate(dataFinal);
    } else {
      console.error('One of the required parameters is undefined');
    }
    // console.log(dataFinal);
  };

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
      Cell: ({ cell: { value }, row: { original } }) => {
        if (isSection(original.section.section)) {
          return (
            <div className="d-flex align-items-center gap-2">
              <span>{value}</span>
              <AddToScheduleModal section={original} onAdd={handleAddToSchedule} />
            </div>
          );
        } else {
          return value;
        }
      },
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
  ];

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
