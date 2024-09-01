import React from "react";

import CourseOverTimeIndexPage from "main/pages/CourseOverTime/CourseOverTimeIndexPage";
import { threeSections } from "fixtures/sectionFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";

export default {
  title: "pages/CourseOverTimeIndexPage",
  component: CourseOverTimeIndexPage,
  parameters: {
    mockData: [
      {
        url: "/api/UCSBSubjects/all",
        method: "GET",
        status: 200,
        response: ucsbSubjectsFixtures.threeSubjects,
      },
      {
        url: "/api/public/courseovertime/search",
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

const Template = () => <CourseOverTimeIndexPage />;

export const Default = Template.bind({});
