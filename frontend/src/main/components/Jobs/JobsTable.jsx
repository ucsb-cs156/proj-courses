import React from "react";
import OurTable, { DateColumn } from "main/components/OurTable";
import { Link } from "react-router-dom";
import Plaintext from "../Utils/Plaintext";
import { Button } from "react-bootstrap";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

const CANCELLABLE_STATUSES = ["queued", "running"];

export default function JobsTable({ jobs, onCancelled = () => {} }) {
  const testid = "JobsTable";

  const cellToAxiosParamsCancel = (cell) => ({
    url: `/api/jobs/${cell.row.original.id}/cancel`,
    method: "POST",
  });

  const cancelSuccess = () => {
    toast("Cancellation requested.");
    onCancelled();
  };

  // Stryker disable all : hard to test for query caching
  const cancelMutation = useBackendMutation(cellToAxiosParamsCancel, {
    onSuccess: cancelSuccess,
  });
  // Stryker restore all

  const cancelCallback = (cell) => {
    cancelMutation.mutate(cell);
  };

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
      header: "Cancel",
      id: "cancel",
      cell: ({ cell }) =>
        CANCELLABLE_STATUSES.includes(cell.row.original.status) ? (
          <Button
            variant="danger"
            size="sm"
            onClick={() => cancelCallback(cell)}
            data-testid={`JobsTable-cell-row-${cell.row.index}-col-cancel-button`}
          >
            Cancel
          </Button>
        ) : null,
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

  const sortByIdDescending = {
    sorting: [
      {
        id: "id",
        desc: true, // sort by name in descending order by default
      },
    ],
  };

  return (
    <OurTable
      data={jobs}
      columns={columns}
      testid={testid}
      initialState={sortByIdDescending}
    />
  );
}
