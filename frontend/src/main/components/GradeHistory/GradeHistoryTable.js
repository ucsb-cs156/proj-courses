import React from "react";
import OurTable from "main/components/OurTable";

export default function GradeHistoryTable({ details }) {
  const columns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Term",
      accessor: "yyyyq",
    },
    {
      Header: "Course",
      accessor: "course",
    },
    {
      Header: "Instructor",
      accessor: "instructor",
    },
    {
      Header: "Grade",
      accessor: "grade",
    },
    {
      Header: "Count",
      accessor: "count",
    },
    {
      Header: "Subject Area",
      accessor: "subjectArea",
    },
    {
      Header: "Course Number",
      accessor: "courseNum",
    },
  ];

  const testid = "GradeHistoryTable";

  const columnsToDisplay = columns;

  return <OurTable data={details} columns={columnsToDisplay} testid={testid} />;
}
