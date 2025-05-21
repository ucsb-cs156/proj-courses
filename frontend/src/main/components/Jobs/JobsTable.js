import React from "react";
import { Table, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Plaintext from "../Utils/Plaintext";

/**
 * Props:
 * - jobs: Job[]
 * - loading: boolean
 * - error: string|null
 * - sortBy: { id: string, desc: boolean }
 * - onSortChange: (field: string) => void
 * - onPurge: () => void
 */
export default function JobsTable({
  jobs,
  loading,
  error,
  sortBy,
  onSortChange,
  onPurge,
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

  // Header click toggles that field
  const clickHeader = (field) => {
    onSortChange(field);
  };

  // Unified arrow: ▲ / ▼ for the active column
  const SortIcon = ({ field }) => {
    if (sortBy.id !== field) return null;
    return sortBy.desc ? " ▼" : " ▲";
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Job Log</h5>
        <Button variant="danger" size="sm" onClick={onPurge}>
          Purge Logs
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => clickHeader("id")}
            >
              ID<SortIcon field="id" />
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => clickHeader("createdAt")}
            >
              Created At<SortIcon field="createdAt" />
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => clickHeader("updatedAt")}
            >
              Updated At<SortIcon field="updatedAt" />
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => clickHeader("status")}
            >
              Status<SortIcon field="status" />
            </th>
            <th>Log</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No jobs to display.
              </td>
            </tr>
          ) : (
            jobs.map((job, _idx) => {
              const lines = (job.log || "").split("\n");
              const truncated = lines.slice(0, 10).join("\n");
              const needs = lines.length > 10;
              return (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{new Date(job.createdAt).toLocaleString()}</td>
                  <td>{new Date(job.updatedAt).toLocaleString()}</td>
                  <td>{job.status}</td>
                  <td data-testid={`JobsTable-cell-row-${_idx}-col-Log`}>
                    {needs ? (
                      <>
                        <Plaintext text={truncated} />
                        <span>...</span>
                        <br />
                        <Link to={`/admin/jobs/logs/${job.id}`}>
                          View Full Log
                        </Link>
                      </>
                    ) : (
                      <pre>{job.log}</pre>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
}
