import React from "react";
import OurTable, { DateColumn } from "main/components/OurTable";
import { Link } from "react-router-dom";
import Plaintext from "../Utils/Plaintext";

export default function JobsTable({ jobs }) {
  const testid = "JobsTable";

  const columns = [
    {
      header: "id",
      accessorKey: "id", // accessor is the "key" in the data
    },
    DateColumn("Created", (cell) => cell.row.original.createdAt),
    DateColumn("Updated", (cell) => cell.row.original.updatedAt),
    {
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Log",
      accessorKey: "log",
      cell: ({ cell }) => {
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
                <Plaintext text={truncatedLog} />
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

  return <OurTable data={jobs} columns={columns} testid={testid} />;
}
