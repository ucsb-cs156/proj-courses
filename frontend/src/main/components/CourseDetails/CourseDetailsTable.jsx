import React from "react";
import OurTable from "main/components/OurTable";
import {
  convertToFraction,
  formatDays,
  formatInstructors,
  formatLocation,
  formatTime,
} from "main/utils/sectionUtils.jsx";

export default function CourseDetailsTable({ details }) {
  const columns = [
    {
      header: "Course ID",
      accessorKey: "courseId",
    },
    {
      header: "Enroll Code",
      id: "enrollCode",
      cell: ({ cell }) => cell.row.original.classSections[0].enrollCode,
    },
    {
      header: "Section",
      id: "section",
      cell: ({ cell }) => cell.row.original.classSections[0].section,
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Enrolled",
      cell: ({ cell }) =>
        convertToFraction(
          cell.row.original.classSections[0].enrolledTotal,
          cell.row.original.classSections[0].maxEnroll,
        ),
      id: "enrolled",
    },
    {
      header: "Location",
      cell: ({ cell }) =>
        formatLocation(cell.row.original.classSections[0].timeLocations),
      id: "location",
    },
    {
      header: "Days",
      cell: ({ cell }) =>
        formatDays(cell.row.original.classSections[0].timeLocations),
      id: "days",
    },
    {
      header: "Time",
      cell: ({ cell }) =>
        formatTime(cell.row.original.classSections[0].timeLocations),
      id: "time",
    },
    {
      header: "Instructor",
      cell: ({ cell }) =>
        formatInstructors(cell.row.original.classSections[0].instructors),
      id: "instructor",
    },
  ];

  const testid = "CourseDetailsTable";

  const columnsToDisplay = columns;

  return <OurTable data={details} columns={columnsToDisplay} testid={testid} />;
}
