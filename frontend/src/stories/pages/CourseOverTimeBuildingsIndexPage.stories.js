import React from 'react';

import CourseOverTimeBuildingsIndexPage from "main/pages/CourseOverTime/CourseOverTimeBuildingsIndexPage";
import { coursesInLib } from 'fixtures/buildingFixtures';
import { systemInfoFixtures } from 'fixtures/systemInfoFixtures';
import { apiCurrentUserFixtures } from 'fixtures/currentUserFixtures';


export default {
    title: 'pages/CourseOverTimeBuildingsIndexPage',
    component: CourseOverTimeBuildingsIndexPage,
    parameters: {
        mockData: [
            {
                url: '/api/public/courseovertime/buildingsearch',
                method: 'GET',
                status: 200,
                response: coursesInLib
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
        ]
    }
};

const Template = () => <CourseOverTimeBuildingsIndexPage />;

export const Default = Template.bind({});