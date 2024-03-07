import React from "react";
import OurTable from "main/components/OurTable";

export default function CourseDescriptionTable({ course }) {
  const columns = [
    {
      Header: "Description",
      accessor: "description",
    }
  ];

  return <OurTable data={course} columns={columns} testid={"BasicDescriptionTable"} />;
}
