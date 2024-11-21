import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useBackend } from "main/utils/useBackend";
import { Button } from "react-bootstrap";
import JobLogTable from "main/components/Jobs/JobsLogTable";

export default function JobsLogPage() {
  let { id } = useParams();
  const navigate = useNavigate();

  // Fetch the job details based on the job ID
  const {
    data: jobs,
    _error,
    _status,
  } = useBackend([`/api/jobs/${id}`], {
    method: "GET",
    url: `/api/jobs/all`,
  });

  const job = jobs ? jobs.find((job) => String(job.id) === id) : null;

  // Navigate back to the jobs table
  const navigateCallback = () => {
    navigate("/admin/jobs");
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Job Log Details</h1>
        <JobLogTable job={job} />

        {/* Back Button */}
        <Button
          variant="secondary"
          onClick={navigateCallback}
          style={{ marginTop: "20px" }}
        >
          Back to Jobs Table
        </Button>
      </div>
    </BasicLayout>
  );
}
