import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useBackend } from "main/utils/useBackend";
import { Button } from "react-bootstrap";
import JobLogTable from "main/components/Jobs/JobsLogTable";

export default function JobsLogPage() {
  let { id } = useParams();
  const navigate = useNavigate();

  // Stryker disable all
  const {
    data: jobs,
    _error,
    _status,
  } = useBackend([`/api/jobs/all`], {
    method: "GET",
    url: `/api/jobs/all`,
  });

  // Navigate back to the jobs table
  const navigateCallback = () => {
    navigate("/admin/jobs");
  };
  // Stryker restore all

  const job = jobs ? jobs.find((job) => String(job.id) === id) : null;

  return (
    <BasicLayout>
      <div className="pt-2">
        {/* Back Button */}
        <Button variant="secondary" onClick={navigateCallback}>
          Back to Jobs Table
        </Button>

        <h1>Job Log Details</h1>
        <JobLogTable job={job} />
      </div>
    </BasicLayout>
  );
}
