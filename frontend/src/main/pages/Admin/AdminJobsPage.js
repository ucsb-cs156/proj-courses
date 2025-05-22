import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import JobsTable from "main/components/Jobs/JobsTable";
import { useBackend } from "main/utils/useBackend";
import { Button, Pagination } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import TestJobForm from "main/components/Jobs/TestJobForm";
import SingleButtonJobForm from "main/components/Jobs/SingleButtonJobForm";

import { useBackendMutation } from "main/utils/useBackend";
import UpdateCoursesJobForm from "main/components/Jobs/UpdateCoursesJobForm";
import UpdateCoursesByQuarterJobForm from "main/components/Jobs/UpdateCoursesByQuarterJobForm";
import UpdateCoursesByQuarterRangeJobForm from "main/components/Jobs/UpdateCoursesByQuarterRangeJobForm";

const AdminJobsPage = () => {
  const refreshJobsIntervalMilliseconds = 5000;
  const [page, setPage] = useState(0);
  const size = 10; // 每页条数
  // test job

  const objectToAxiosParamsTestJob = (data) => ({
    url: `/api/jobs/launch/testjob?fail=${data.fail}&sleepMs=${data.sleepMs}`,
    method: "POST",
  });

  // Stryker disable all
  const testJobMutation = useBackendMutation(objectToAxiosParamsTestJob, {}, [
    "/api/jobs/all",
  ]);
  // Stryker restore all

  const submitTestJob = async (data) => {
    testJobMutation.mutate(data);
  };

  // purge job

  const objectToAxiosParamsPurgeJobLog = () => ({
    url: "/api/jobs/all",
    method: "DELETE",
  });

  // Stryker disable all
  const purgeJobLogMutation = useBackendMutation(
    objectToAxiosParamsPurgeJobLog,
    {},
    ["/api/jobs/all"],
  );
  // Stryker restore all

  const purgeJobLog = async () => {
    purgeJobLogMutation.mutate();
  };

  const objectToAxiosParamsUpdateCoursesJob = (data) => ({
    url: `/api/jobs/launch/updateCourses?quarterYYYYQ=${data.quarter}&subjectArea=${data.subject}&ifStale=${data.ifStale}`,
    method: "POST",
  });

  const objectToAxiosParamsUpdateCoursesByQuarterJob = (data) => ({
    url: `/api/jobs/launch/updateQuarterCourses?quarterYYYYQ=${data.quarter}&ifStale=${data.ifStale}`,
    method: "POST",
  });

  const objectToAxiosParamsUpdateCoursesByQuarterRangeJob = (data) => ({
    url: `/api/jobs/launch/updateCoursesRangeOfQuarters?start_quarterYYYYQ=${data.startQuarter}&end_quarterYYYYQ=${data.endQuarter}&ifStale=${data.ifStale}`,
    method: "POST",
  });

  const objectToAxiosParamsUpdateGradeInfoJob = () => ({
    url: "/api/jobs/launch/uploadGradeData",
    method: "POST",
  });

  // Stryker disable all

  const updateCoursesJobMutation = useBackendMutation(
    objectToAxiosParamsUpdateCoursesJob,
    {},
    ["/api/jobs/all"],
  );

  const updateCoursesByQuarterJobMutation = useBackendMutation(
    objectToAxiosParamsUpdateCoursesByQuarterJob,
    {},
    ["/api/jobs/all"],
  );

  const updateCoursesByQuarterRangeJobMutation = useBackendMutation(
    objectToAxiosParamsUpdateCoursesByQuarterRangeJob,
    {},
    ["/api/jobs/all"],
  );

  const updateGradeInfoJobMutation = useBackendMutation(
    objectToAxiosParamsUpdateGradeInfoJob,
    {},
    ["/api/jobs/all"],
  );
  // Stryker restore all

  const submitUpdateCoursesJob = async (data) => {
    updateCoursesJobMutation.mutate(data);
  };

  const submitUpdateCoursesByQuarterJob = async (data) => {
    updateCoursesByQuarterJobMutation.mutate(data);
  };

  const submitUpdateCoursesByQuarterRangeJob = async (data) => {
    updateCoursesByQuarterRangeJobMutation.mutate(data);
  };

  const submitUpdateGradeInfoJob = async () => {
    updateGradeInfoJobMutation.mutate();
  };

  // Stryker disable all
  // ── 2. 带分页参数去拉后端 ────────────────────
  const { data } = useBackend(
    ["/api/jobs/all", page, size],
    {
      method: "GET",
      url: "/api/jobs/all",
      params: { page, size },
    },
    [],
    { refetchInterval: refreshJobsIntervalMilliseconds },
  );

  // 兼容：如果 data 是一个数组，就直接用它；否则用 data.content，并取 totalPages
  const jobs = Array.isArray(data) ? data : data?.content || [];
  const totalPages = Array.isArray(data) ? 1 : (data?.totalPages ?? 1);

  // Stryker restore  all

  const jobLaunchers = [
    {
      name: "Test Job",
      form: <TestJobForm submitAction={submitTestJob} />,
    },
    {
      name: "Update Courses Database",
      form: <UpdateCoursesJobForm callback={submitUpdateCoursesJob} />,
    },
    {
      name: "Update Courses Database by quarter",
      form: (
        <UpdateCoursesByQuarterJobForm
          callback={submitUpdateCoursesByQuarterJob}
        />
      ),
    },
    {
      name: "Update Courses Database by quarter range",
      form: (
        <UpdateCoursesByQuarterRangeJobForm
          callback={submitUpdateCoursesByQuarterRangeJob}
        />
      ),
    },
    {
      name: "Update Grade Info",
      form: (
        <SingleButtonJobForm
          callback={submitUpdateGradeInfoJob}
          text={"Update Grades"}
        />
      ),
    },
  ];

  return (
    <BasicLayout>
      <h2 className="p-3">Launch Jobs</h2>
      <Accordion>
        {jobLaunchers.map((jobLauncher, index) => (
          <Accordion.Item eventKey={index} key={index}>
            <Accordion.Header>{jobLauncher.name}</Accordion.Header>
            <Accordion.Body>{jobLauncher.form}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <h2 className="p-3">Job Status</h2>

      <JobsTable jobs={jobs} />
      <Button
        variant="danger"
        onClick={purgeJobLog}
        data-testid="purgeJobLog"
        className="mb-3"
      >
        Purge Job Log
      </Button>
      {/* ── 3. 渲染分页条 ───────────────────────── */}
      <div className="d-flex justify-content-center">
        <Pagination.Prev
          data-testid="pagination-prev"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
        />
        {Array.from({ length: totalPages }).map((_, idx) => (
          <Pagination.Item
            key={idx}
            data-testid={`pagination-button-${idx + 1}`}
            active={idx === page}
            onClick={() => setPage(idx)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          data-testid="pagination-next"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
        />
      </div>
    </BasicLayout>
  );
};

export default AdminJobsPage;
