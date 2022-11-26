import React from 'react';

import AdminJobsPage from "main/pages/AdminJobsPage";
import jobsFixtures from 'fixtures/jobsFixtures';
import { systemInfoFixtures } from 'fixtures/systemInfoFixtures';
import { ucsbSubjectsFixtures } from 'fixtures/ucsbSubjectsFixtures';
import { apiCurrentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'pages/AdminJobsPage',
    component: AdminJobsPage,
    parameters: {
        mockData: [
            {
                url: '/api/UCSBSubjects/all',
                method: 'GET',
                status: 200,
                response: ucsbSubjectsFixtures.threeSubjects
            },
            {
                url: '/api/jobs/all',
                method: 'GET',
                status: 200,
                response: jobsFixtures.sixJobs
            },
            {
                url: '/api/systemInfo',
                method: 'GET',
                status: 200,
                response: systemInfoFixtures.showingBoth
            },
            {
                url: '/api/currentUser',
                method: 'GET',
                status: 200,
                response: apiCurrentUserFixtures.adminUser
            },
        ],
    },
};

const Template = () => <AdminJobsPage />;

export const Default = Template.bind({});

