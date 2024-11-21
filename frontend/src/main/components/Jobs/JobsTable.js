import React from "react";
import OurTable, { DateColumn } from "main/components/OurTable";
import { Link } from "react-router-dom";

export default function JobsTable({ jobs }) {
  const testid = "JobsTable";

  const truncateLog = (log) => {
    const lines = log.split("\n");
    return lines.slice(0, 10).join("\n");
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
    {
      Header: "Log",
      id: "log",
      Cell: ({ cell }) => {
        const log = cell.row.original.log;
        const id = cell.row.original.id;
        const truncatedLog = truncateLog(log);
        return (
          <div>
            <pre>{truncatedLog}</pre>
            {log.split("\n").length > 10 && (
              <div>
                <pre>...</pre>
                <Link
                  to={`/admin/jobs/logs/${id}`}
                  date-testid={`${testid}-see-entire-log-${id}`}
                >
                  [See entire log]
                </Link>
              </div>
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
