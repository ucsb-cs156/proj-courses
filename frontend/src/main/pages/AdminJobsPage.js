import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import JobsTable from "main/components/Jobs/JobsTable";
import { useBackend } from "main/utils/useBackend";
import Accordion from "react-bootstrap/Accordion";
import TestJobForm from "main/components/Jobs/TestJobForm";
import JobComingSoon from "main/components/Jobs/JobComingSoon";

import { useBackendMutation } from "main/utils/useBackend";
import UpdateCoursesJobForm from "main/components/Jobs/UpdateCoursesJobForm";
import UpdateCoursesByQuarterJobForm from "main/components/Jobs/UpdateCoursesByQuarterJobForm";
import UpdateCoursesByQuarterRangeJobForm from "main/components/Jobs/UpdateCoursesByQuarterRangeJobForm";
import UploadGradeDataJobForm from "main/components/Jobs/UploadGradeDataJobForm";

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

  const objectToAxiosParamsUpdateCoursesJob = (data) => ({
    url: `/api/jobs/launch/updateCourses?quarterYYYYQ=${data.quarter}&subjectArea=${data.subject}`,
    method: "POST",
  });

  const objectToAxiosParamsUpdateCoursesByQuarterJob = (data) => ({
    url: `/api/jobs/launch/updateQuarterCourses?quarterYYYYQ=${data.quarter}`,
    method: "POST",
  });

  const objectToAxiosParamsUpdateCoursesByQuarterRangeJob = (data) => ({
    url: `/api/jobs/launch/updateCoursesRangeOfQuarters?start_quarterYYYYQ=${data.startQuarter}&end_quarterYYYYQ=${data.endQuarter}`,
    method: "POST",
  });

  // ***** upload grades job *******
  const objectToAxiosParamsUploadGradeDataJob = () => ({
    url: `/api/jobs/launch/uploadGradeData`,
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

  const uploadGradeDataMutation = useBackendMutation(
    objectToAxiosParamsUploadGradeDataJob,
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

  const submitUploadGradeDataJob = async (data) => {
    uploadGradeDataMutation.mutate(data);
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
      name: "Update Course Database by quarter range for one subject",
      form: <JobComingSoon />,
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
      form: <UploadGradeDataJobForm callback={submitUploadGradeDataJob} />,
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
