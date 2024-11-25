import React from "react";
import OurTable from "main/components/OurTable";

function JobLogTable({ job }) {
  const testid = "JobLogTable";

  // Ensure job and log data are present
  if (!job) {
    return <p data-testid={`${testid}-not-found`}>Job not found.</p>;
  }

  const logLines = job.log ? job.log.split("\n") : [];

  const logData = logLines.map((line, index) => ({
    index: index + 1,
    logLine: line,
  }));

  const logColumns = [
    {
      Header: "#",
      accessor: "index", // accessor is the "key" in the data
    },
    {
      Header: "Log Line",
      accessor: "logLine",
    },
  ];

  const jobData = [
    { field: "ID", value: job.id },
    { field: "Created", value: new Date(job.createdAt).toLocaleString() },
    { field: "Updated", value: new Date(job.updatedAt).toLocaleString() },
    { field: "Status", value: job.status },
  ];

  const jobColumns = [
    {
      Header: "Field",
      accessor: "field",
    },
    {
      Header: "Value",
      accessor: "value",
    },
  ];

  return (
    <div>
      <h3>Job Information</h3>
      <OurTable data={jobData} columns={jobColumns} testid={testid} />
      <h3>Job Log</h3>
      <OurTable data={logData} columns={logColumns} testid={testid} />
    </div>
  );
}

export default JobLogTable;
