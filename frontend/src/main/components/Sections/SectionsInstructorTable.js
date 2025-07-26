import SectionsInstructorTableBase from "main/components/SectionsInstructorTableBase";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
import {
  convertToFraction,
  formatDays,
  formatInstructors,
  formatLocation,
  formatTime,
  formatStatus,
} from "main/utils/sectionUtils.js";

export default function SectionsInstructorTable({ sections }) {
  const columns = [
    {
      Header: "Quarter",
      cell: ({cell}) => yyyyqToQyy(cell.row.original.courseInfo.quarter),
      disableGroupBy: true,
      id: "quarter",
    },
    {
      Header: "Course ID",
      accessorKey: "courseId",
      disableGroupBy: true,
      cell: ({ cell }) => {
        const value = cell.row.original.courseInfo.courseId;
        return value.substring(0, value.length - 2)
      }
    },
    {
      Header: "Title",
      accessor: "courseInfo.title",
      disableGroupBy: true,
    },
    {
      Header: "Status",
      cell: ({cell}) => formatStatus(cell.row.original.section),
      disableGroupBy: true,
      id: "status",
    },
    {
      Header: "Enrolled",
      cell: ({cell}) =>
        convertToFraction(
          cell.row.original.section.enrolledTotal,
          cell.row.original.section.maxEnroll
        ),
      disableGroupBy: true,
      id: "enrolled",
    },
    {
      Header: "Location",
      cell: ({cell}) =>
        formatLocation(cell.row.original.section.timeLocations),
      disableGroupBy: true,
      id: "location",
    },
    {
      Header: "Days",
      cell: ({cell}) => formatDays(cell.row.original.section.timeLocations),
      disableGroupBy: true,
      id: "days",
    },
    {
      Header: "Time",
      cell: ({cell}) => formatTime(cell.row.original.section.timeLocations),
      disableGroupBy: true,
      id: "time",
    },
    {
      Header: "Instructor",
      cell: ({cell}) =>
          formatInstructors(cell.row.original.section.instructors),
      disableGroupBy: true,
      id: "instructor",
    },
    {
      Header: "Enroll Code",
      cell: ({cell}) => cell.row.original.section.enrollCode,
      id: "enrollCode",
      disableGroupBy: true,
    },
  ];

  const testid = "SectionsInstructorTable";

  const columnsToDisplay = columns;

  return (
    <SectionsInstructorTableBase
      data={sections}
      columns={columnsToDisplay}
      testid={testid}
    />
  );
}
