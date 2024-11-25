import React from "react";
import OurTable, {
  PlaintextColumn,
  DateColumn,
} from "main/components/OurTable";

export function truncateLines(lines) {
  return lines.slice(0, 10).join("\n");
}

export default function JobsTable({ jobs }) {
  const testid = "JobsTable";

  const truncateLog = (log) => {
    if (log) {
      const lines = log.split("\n");
      return truncateLines(lines);
    }
    return "";
  };

  const columns = [
    {
      Header: "id",
      accessor: "id", // accessor is the "key" in the data
    },
    DateColumn("Created", (cell) => cell.row.original.createdAt),
    DateColumn("Updated", (cell) => cell.row.original.updatedAt),
    {
      Header: "Status",
      accessor: "status",
    },
    PlaintextColumn("Log", (cell) => truncateLog(cell.row.original.log)),
  ];

  const sortees = React.useMemo(
    () => [
      {
        id: "id",
        desc: true,
      },
    ],
    // Stryker disable next-line all
    [],
  );

  return (
    <OurTable
      data={jobs}
      columns={columns}
      testid={testid}
      initialState={{ sortBy: sortees }}
    />
  );
}
