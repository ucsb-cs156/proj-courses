import React from "react";
import OurTable from "main/components/OurTable";
import {
  convertToFraction,
  formatInstructors,
  formatLocation,
  formatTime,
} from "main/utils/sectionUtils.js";

export default function PersonalSectionsTable({ personalSections }) {
  const columns = [
    {
      Header: "Course ID",
      accessor: "courseId",
    },
    {
      Header: "Enroll Code",
      accessor: "classSections[0].enrollCode",
    },
    {
      Header: "Section",
      accessor: "classSections[0].section",
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Enrolled",
      accessor: (row) =>
        convertToFraction(
          row.classSections[0].enrolledTotal,
          row.classSections[0].maxEnroll,
        ),
      id: "enrolled",
    },
    {
      Header: "Location",
      accessor: (row) => formatLocation(row.classSections[0].timeLocations),
      id: "location",
    },
    {
      Header: "Days",
      accessor: "classSections[0].timeLocations[0].days",
    },
    {
      Header: "Time",
      accessor: (row) => formatTime(row.classSections[0].timeLocations),
      id: "time",
    },
    {
      Header: "Instructor",
      accessor: (row) => formatInstructors(row.classSections[0].instructors),
      id: "instructor",
    },
  ];

  const testid = "PersonalSectionsTable";

  const columnsToDisplay = columns;

  return (
    <OurTable
      data={personalSections}
      columns={columnsToDisplay}
      testid={testid}
    />
  );
}
