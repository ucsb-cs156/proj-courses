import React from "react";
import { Table, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Plaintext from "../Utils/Plaintext";

export default function JobsTable({
  jobs = [],
  loading = false,
  error = null,
  sortBy = { id: "id", desc: true },
  onSortChange = () => {},
  onPurge = () => {},
}) {
  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
      </div>
    );
  }
  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        {error}
      </Alert>
    );
  }

  const clickHeader = (field) => {
    onSortChange(field);
  };

  const SortIcon = ({ field }) => {
    if (sortBy.id !== field) {
      return <span data-testid={`JobsTable-header-${field}-sort-carets`} />;
    }
    return (
      <span data-testid={`JobsTable-header-${field}-sort-carets`}>
        {sortBy.desc ? "🔽" : "🔼"}
      </span>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Job Log</h5>
        <Button variant="danger" size="sm" onClick={onPurge}>
          Purge Job Log
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => clickHeader("id")}
              >
                id
                <SortIcon field="id" />
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => clickHeader("createdAt")}
              >
                Created
                <SortIcon field="createdAt" />
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => clickHeader("updatedAt")}
              >
                Updated
                <SortIcon field="updatedAt" />
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => clickHeader("status")}
              >
                Status
                <SortIcon field="status" />
              </th>
              <th>Log</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  no jobs to display.
                </td>
              </tr>
            ) : (
              jobs.map((job, idx) => {
                const raw = job.log ?? "";
                const lines = raw.split("\n");
                const needsTruncate = lines.length > 10;
                const truncated = lines.slice(0, 10).join("\n");

                const formatValue = (value) => {
                  if (typeof value === "string") {
                    return new Date(value).toLocaleString(undefined, {
                      hour12: false,
                    });
                  }
                  return value;
                };

                return (
                  <tr key={job.id}>
                    <td data-testid={`JobsTable-cell-row-${idx}-col-id`}>
                      {job.id}
                    </td>
                    <td data-testid={`JobsTable-cell-row-${idx}-col-Created`}>
                      {job.createdAt}
                    </td>
                    <td data-testid={`JobsTable-cell-row-${idx}-col-Updated`}>
                      {formatValue(job.updatedAt)}
                    </td>
                    <td data-testid={`JobsTable-cell-row-${idx}-col-status`}>
                      {job.status}
                    </td>
                    <td data-testid={`JobsTable-cell-row-${idx}-col-Log`}>
                      {raw === "" ? (
                        <span>No logs available</span>
                      ) : needsTruncate ? (
                        <>
                          <Plaintext text={truncated} />
                          <span>...</span>
                          <br />
                          <Link to={`/admin/jobs/logs/${job.id}`}>
                            See entire log
                          </Link>
                        </>
                      ) : (
                        <pre>{raw}</pre>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
