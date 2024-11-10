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
      accessor: (row) => yyyyqToQyy(row.courseInfo.quarter),
      // Stryker disable next-line BooleanLiteral : TODO: Write a test that will check for whether this is set to true
      disableGroupBy: true,
      id: "quarter",
      Cell: ({ cell: { value } }) => value,
    },
    {
      Header: "Course ID",
      accessor: "courseInfo.courseId",
      // Stryker disable next-line BooleanLiteral : TODO: Write a test that will check for whether this is set to true
      disableGroupBy: true,
      Cell: ({ cell: { value } }) => value.substring(0, value.length - 2),
    },
    {
      Header: "Title",
      accessor: "courseInfo.title",
      // Stryker disable next-line BooleanLiteral : TODO: Write a test that will check for whether this is set to true
      disableGroupBy: true,
    },
    {
      Header: "Status",
      accessor: (row) => formatStatus(row.section),
      // Stryker disable next-line BooleanLiteral : TODO: Write a test that will check for whether this is set to true
      disableGroupBy: true,
      id: "status",
    },
    {
      Header: "Enrolled",
      accessor: (row) =>
        convertToFraction(row.section.enrolledTotal, row.section.maxEnroll),
      // Stryker disable next-line BooleanLiteral : TODO: Write a test that will check for whether this is set to true
      disableGroupBy: true,
      id: "enrolled",
    },
    {
      Header: "Location",
      accessor: (row) => formatLocation(row.section.timeLocations),
      // Stryker disable next-line BooleanLiteral : TODO: Write a test that will check for whether this is set to true
      disableGroupBy: true,
      id: "location",
    },
    {
      Header: "Days",
      accessor: (row) => formatDays(row.section.timeLocations),
      // Stryker disable next-line BooleanLiteral : TODO: Write a test that will check for whether this is set to true
      disableGroupBy: true,
      id: "days",
    },
    {
      Header: "Time",
      accessor: (row) => formatTime(row.section.timeLocations),
      // Stryker disable next-line BooleanLiteral : TODO: Write a test that will check for whether this is set to true
      disableGroupBy: true,
      id: "time",
    },
    {
      Header: "Instructor",
      accessor: (row) => formatInstructors(row.section.instructors),
      // Stryker disable next-line BooleanLiteral : TODO: Write a test that will check for whether this is set to true
      disableGroupBy: true,
      id: "instructor",
    },
    {
      Header: "Enroll Code",
      accessor: "section.enrollCode",
      // Stryker disable next-line BooleanLiteral : TODO: Write a test that will check for whether this is set to true
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
