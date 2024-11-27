import React from "react";
import OurTable from "main/components/OurTable";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

export default function UpdateTable({ updates, testIdPrefix = "UpdateTable" }) {
  const columns = [
    {
      Header: "Subject Area",
      accessor: "subjectArea",
    },
    {
      Header: "Quarter",
      accessor: "quarter",
      Cell: ({ cell: { value } }) => {
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

  return <OurTable data={updates} columns={columns} testid={testIdPrefix} />;
}
