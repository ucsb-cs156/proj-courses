import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import JobsTable from "main/components/Jobs/JobsTable";
import { useBackend } from "main/utils/useBackend";
import Accordion from "react-bootstrap/Accordion";
import TestJobForm from "main/components/Jobs/TestJobForm";
import UpdateGradeInfoForm from "main/components/Jobs/UpdateGradeInfoForm";
import ClearJobLogsForm from "main/components/Jobs/ClearJobLogsForm";

import { useBackendMutation } from "main/utils/useBackend";
import UpdateCoursesJobForm from "main/components/Jobs/UpdateCoursesJobForm";
import UpdateCoursesByQuarterJobForm from "main/components/Jobs/UpdateCoursesByQuarterJobForm";
import UpdateCoursesByQuarterRangeJobForm from "main/components/Jobs/UpdateCoursesByQuarterRangeJobForm";

const AdminJobsPage = () => {
  const refreshJobsIntervalMilliseconds = 5000;

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

  // ***** update courses job *******

  const objectToAxiosParamsClearJobLogs = () => ({
    url: "/api/jobs/all",
    method: "DELETE",
  });

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
  const clearJobLogsMutation = useBackendMutation(
    objectToAxiosParamsClearJobLogs,
    {},
    ["/api/jobs/all"],
  );
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

  const clearJobLogs = async () => {
    clearJobLogsMutation.mutate();
  };

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
  const {
    data: jobs,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/jobs/all"],
    {
      method: "GET",
      url: "/api/jobs/all",
    },
    [],
    { refetchInterval: refreshJobsIntervalMilliseconds },
  );
  // Stryker restore  all

  const jobLaunchers = [
    {
      name: "Test Job",
      form: <TestJobForm submitAction={submitTestJob} />,
    },
    {
      name: "Clear Job Logs",
      form: <ClearJobLogsForm callback={clearJobLogs} />,
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
      form: <UpdateGradeInfoForm callback={submitUpdateGradeInfoJob} />,
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
    </BasicLayout>
  );
};

export default AdminJobsPage;
