import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useBackend } from "main/utils/useBackend";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

const AdminJobLogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: jobLogs } = useBackend([`/api/jobs/logs/${id}`], {
    method: "GET",
    url: `/api/jobs/logs/${id}`,
  });

  const handleBack = () => {
    navigate("/admin/jobs");
  };

  return (
    <BasicLayout>
      <Button onClick={handleBack}>Back to Job List</Button>
      <h3>Job Logs for Job {id}</h3>
      {jobLogs ? <pre>{jobLogs}</pre> : <p>Loading...</p>}
    </BasicLayout>
  );
};

export default AdminJobLogPage;
