import React from "react";
import OurTable from "main/components/OurTable";
import { yyyyqToQyy } from "main/utils/quarterUtilities";

export default function UpdatesTable({
  Update,
  testIdPrefix = "UpdatesTable",
}) {
  const columns = [
    {
      Header: "Subject Area",
      accessor: "subjectArea",
    },
    {
      Header: "Quarter", // formatted in QXX
      accessor: "quarter",
      Cell: ({ value }) => {
        return yyyyqToQyy(value);
      },
    },
    {
      Header: "Saved",
      accessor: "saved",
    },
    {
      Header: "Updated",
      accessor: "updated",
    },
    {
      Header: "Errors",
      accessor: "errors",
    },
    {
      Header: "Last Update",
      accessor: "lastUpdate",
    },
  ];

  return <OurTable data={Update} columns={columns} testid={testIdPrefix} />;
}
