import React from "react";
import OurTable from "main/components/OurTable";

export default function CourseDescriptionTable({ desc }) {
  const columns = [
    {
      Header: "Description",
      accessor: "description",
    }
  ];

  const testid = "CourseDescriptionTable";

  return <OurTable data={desc} columns={columns} testid={testid} />;
}
