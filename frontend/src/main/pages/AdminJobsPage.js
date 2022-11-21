import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import JobsTable from "main/components/Jobs/JobsTable";
import { useBackend } from "main/utils/useBackend";
import Accordion from 'react-bootstrap/Accordion';
import TestJobForm from "main/components/Jobs/TestJobForm";
import JobComingSoon from "main/components/Jobs/JobComingSoon";

import { useBackendMutation } from "main/utils/useBackend";
import UpdateCoursesJobForm from "main/components/Jobs/UpdateCoursesJobForm";

const AdminJobsPage = () => {

    const refreshJobsIntervalMilliseconds = 5000;

    // test job 

    const objectToAxiosParamsTestJob = (data) => ({
        url: `/api/jobs/launch/testjob?fail=${data.fail}&sleepMs=${data.sleepMs}`,
        method: "POST"
    });

    // Stryker disable all
    const testJobMutation = useBackendMutation(
        objectToAxiosParamsTestJob,
        {},
        ["/api/jobs/all"]
    );
    // Stryker enable all

    const submitTestJob = async (data) => {
        console.log("submitTestJob, data=", data);
        testJobMutation.mutate(data);
    }

    // ***** update courses job *******

    const objectToAxiosParamsUpdateCoursesJob = (data) => ({
        url: `/api/jobs/launch/updateCourses?quarterYYYYQ=${data.quarter}&subjectArea=${data.subject}`,
        method: "POST"
    });

    // Stryker disable all
    const updateCoursesJobMutation = useBackendMutation(
        objectToAxiosParamsUpdateCoursesJob,
        {},
        ["/api/jobs/all"]
    );
    // Stryker enable all

    const submitUpdateCoursesJob = async (data) => {
        console.log("submitUpdateCoursesJob, data=", data);
        updateCoursesJobMutation.mutate(data);
    }

    // Stryker disable all 
    const { data: jobs, error: _error, status: _status } =
        useBackend(
            ["/api/jobs/all"],
            {
                method: "GET",
                url: "/api/jobs/all",
            },
            [],
            { refetchInterval: refreshJobsIntervalMilliseconds }
        );
    // Stryker enable  all 

    const jobLaunchers = [
        {
            name: "Test Job",
            form: <TestJobForm submitAction={submitTestJob} />
        },
        {
            name: "Update Courses Database",
            form: <UpdateCoursesJobForm callback={submitUpdateCoursesJob}  />
        },
        {
            name: "Update Grade Info",
            form: <JobComingSoon />
        },
    ]


    return (
        <BasicLayout>
            <h2 className="p-3">Launch Jobs</h2>
            <Accordion>
                {
                    jobLaunchers.map((jobLauncher, index) => (
                        <Accordion.Item eventKey={index} key={index}>
                            <Accordion.Header>{jobLauncher.name}</Accordion.Header>
                            <Accordion.Body>
                                {jobLauncher.form}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))
                }
            </Accordion>

            <h2 className="p-3">Job Status</h2>

            <JobsTable jobs={jobs} />
        </BasicLayout>
    );
};

export default AdminJobsPage;
