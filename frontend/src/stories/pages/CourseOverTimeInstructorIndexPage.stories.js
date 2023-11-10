import React from "react";

import CourseOverTimeInstructorIndexPage from "main/pages/CourseOverTime/CourseOverTimeInstructorIndexPage";
import { threeSections } from "fixtures/sectionFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";

export default {
  title: "pages/CourseOverTimeInstructorIndexPage",
  component: CourseOverTimeInstructorIndexPage,
  parameters: {
    mockData: [
      {
        url: "/api/UCSBSubjects/all",
        method: "GET",
        status: 200,
        response: ucsbSubjectsFixtures.threeSubjects,
      },
      {
        url: "/api/public/courseovertime/instructorsearch",
        method: "GET",
        status: 200,
        response: threeSections,
      },
      {
        url: "/api/systemInfo",
        method: "GET",
        status: 200,
        response: systemInfoFixtures.showingBoth,
      },
      {
        url: "/api/currentUser",
        method: "GET",
        status: 200,
        response: apiCurrentUserFixtures.adminUser,
      },
    ],
  },
};

const Template = () => <CourseOverTimeInstructorIndexPage />;

export const Default = Template.bind({});
