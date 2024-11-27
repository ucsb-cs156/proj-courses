import React from "react";
import OurTable, { DateColumn } from "main/components/OurTable";
import { Link } from "react-router-dom";

export default function JobsTable({ jobs }) {
  const testid = "JobsTable";

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
    {
      Header: "Log",
      accessor: "log",
      Cell: ({ cell }) => {
        const log = cell.row.original.log;
        if (!log) {
          return (
            <div data-testid={`JobsTable-cell-row-${cell.row.index}-col-Log`}>
              No logs available
            </div>
          );
        }
        const logLines = log.split("\n");
        const truncatedLog = logLines.slice(0, 10).join("\n");
        return (
          <div data-testid={`JobsTable-cell-row-${cell.row.index}-col-Log`}>
            {logLines.length > 10 ? (
              <>
                {truncatedLog}
                <span>...</span>
                <br />
                <Link to={`/admin/jobs/logs/${cell.row.original.id}`}>
                  See entire log
                </Link>
              </>
            ) : (
              <pre>{log}</pre>
            )}
          </div>
        );
      },
    },
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
