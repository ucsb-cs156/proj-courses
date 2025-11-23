import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import JobsTable from "main/components/Jobs/JobsTable";
import { useBackend } from "main/utils/useBackend";
import { Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import TestJobForm from "main/components/Jobs/TestJobForm";
import SingleButtonJobForm from "main/components/Jobs/SingleButtonJobForm";
import useLocalStorage from "main/utils/useLocalStorage";
import OurPagination from "main/components/Utils/OurPagination";
import JobsSearchForm from "main/components/Jobs/JobsSearchForm";

import { useBackendMutation } from "main/utils/useBackend";
import UpdateCoursesJobForm from "main/components/Jobs/UpdateCoursesJobForm";
import UpdateCoursesByQuarterJobForm from "main/components/Jobs/UpdateCoursesByQuarterJobForm";
import UpdateCoursesByQuarterRangeJobForm from "main/components/Jobs/UpdateCoursesByQuarterRangeJobForm";

const AdminJobsPage = () => {
  const [selectedPage, setSelectedPage] = useState(1);
  const refreshJobsIntervalMilliseconds = 5000;

  const [sortField, setSortField] = useLocalStorage(
    "JobsSearch.SortField",
    "status",
  );
  const [sortDirection, setSortDirection] = useLocalStorage(
    "JobsSearch.SortDirection",
    "DESC",
  );
  const [pageSize, setPageSize] = useLocalStorage("JobsSearch.PageSize", "10");

  // test job

  const objectToAxiosParamsTestJob = (data) => ({
    url: `/api/jobs/launch/testjob?fail=${data.fail}&sleepMs=${data.sleepMs}`,
    method: "POST",
  });

  // Stryker disable all
  const testJobMutation = useBackendMutation(objectToAxiosParamsTestJob, {}, [
    "/api/jobs/paginated",
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
    ["/api/jobs/paginated"],
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
    ["/api/jobs/paginated"],
  );

  const updateCoursesByQuarterJobMutation = useBackendMutation(
    objectToAxiosParamsUpdateCoursesByQuarterJob,
    {},
    ["/api/jobs/paginated"],
  );

  const updateCoursesByQuarterRangeJobMutation = useBackendMutation(
    objectToAxiosParamsUpdateCoursesByQuarterRangeJob,
    {},
    ["/api/jobs/paginated"],
  );

  const updateGradeInfoJobMutation = useBackendMutation(
    objectToAxiosParamsUpdateGradeInfoJob,
    {},
    ["/api/jobs/paginated"],
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
  const { data: page } = useBackend(
    ["/api/jobs/paginated", selectedPage, pageSize, sortField, sortDirection],
    {
      method: "GET",
      url: "/api/jobs/paginated",
      params: {
        page: selectedPage - 1,
        pageSize: parseInt(pageSize) || 10,
        sortField: sortField,
        sortDirection: sortDirection,
      },
    },
    { content: [], totalPages: 0 },
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
      <JobsSearchForm
        updateSortField={setSortField}
        updateSortDirection={setSortDirection}
        updatePageSize={setPageSize}
      />
      <OurPagination
        updateActivePage={setSelectedPage}
        totalPages={page.totalPages}
      />
      <JobsTable jobs={page.content} />
      <Button variant="danger" onClick={purgeJobLog} data-testid="purgeJobLog">
        Purge Job Log
      </Button>
    </BasicLayout>
  );
};

export default AdminJobsPage;
