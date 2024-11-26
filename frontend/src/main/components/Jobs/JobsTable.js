import React from "react";
import { Link } from "react-router-dom";
import OurTable, {
  //PlaintextColumn,
  DateColumn,
} from "main/components/OurTable";

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
        const logLines = log ? log.split("\n") : [];
        if (logLines.length > 1) {
          return (
            <div>
              {logLines.slice(0, 10).join("\n")}
              <span>...</span>
              <br />
              <Link to={`/admin/jobs/logs/${cell.row.original.id}`}>
                See entire log
              </Link>
            </div>
          );
        } else {
          return <pre>{log}</pre>;
        }
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
