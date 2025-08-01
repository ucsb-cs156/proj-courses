import React from "react";
import OurTable from "main/components/OurTable";
import {
  convertToFraction,
  formatInstructors,
  formatLocation,
  formatTime,
} from "main/utils/sectionUtils.js";

export default function CourseDetailsTable({ details }) {
  const columns = [
    {
      header: "Course ID",
      accessorKey: "courseId",
    },
    {
      header: "Enroll Code",
      accessorKey: "enrollCode",
      cell: ({ cell }) => cell.row.original.classSections[0].enrollCode,
    },
    {
      header: "Section",
      accessorKey: "section",
      cell: ({ cell }) => cell.row.original.classSections[0].section,
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Enrolled",
      accessorKey: "enrolled",
      cell: ({ cell }) =>
        convertToFraction(
          cell.row.original.classSections[0].enrolledTotal,
          cell.row.original.classSections[0].maxEnroll,
        ),
      id: "enrolled",
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: ({ cell }) =>
        formatLocation(cell.row.original.classSections[0].timeLocations),
      id: "location",
    },
    {
      header: "Days",
      accessorKey: "days",
      cell: ({ cell }) =>
        cell.row.original.classSections[0].timeLocations[0].days,
      id: "days",
    },
    {
      header: "Time",
      cell: ({ cell }) =>
        formatTime(cell.row.original.classSections[0].timeLocations),
      id: "time",
      accessorKey: "time",
    },
    {
      header: "Instructor",
      accessorKey: "instructor",
      cell: ({ cell }) =>
        formatInstructors(cell.row.original.classSections[0].instructors),
      id: "instructor",
    },
  ];

  const testid = "CourseDetailsTable";

  const columnsToDisplay = columns;

  return <OurTable data={details} columns={columnsToDisplay} testid={testid} />;
}
