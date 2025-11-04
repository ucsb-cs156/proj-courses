import React from "react";

import CourseDetailsIndexPage from "main/pages/CourseDetails/CourseDetailsIndexPage";

import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";
import { oneQuarterCourse } from "fixtures/gradeHistoryFixtures";

import { http, HttpResponse } from "msw";

import {
  withRouter,
  reactRouterParameters,
} from "storybook-addon-remix-react-router";

export default {
  title: "pages/CourseDetails/CourseDetailsIndexPage",
  component: CourseDetailsIndexPage,
  decorators: [withRouter],
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { qtr: "20221", enrollCode: "06619" },
      },
      routing: { path: "/coursedetails/:qtr/:enrollCode" },
    }),
  },
};

const Template = (args) => {
  return <CourseDetailsIndexPage {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  suppressMemoryRouter: true,
};
Default.parameters = {
  msw: [
    http.get("/api/UCSBSubjects/all", () => {
      return HttpResponse.json(ucsbSubjectsFixtures.threeSubjects, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingBoth, {
        status: 200,
      });
    }),
    http.get("/api/currentUser", () => {
      return HttpResponse.status(403); // returns 403 when not logged in
    }),
    http.get("/api/sections/sectionsearch", () => {
      return HttpResponse.json(personalSectionsFixtures.singleSection, {
        status: 200,
      });
    }),
    http.get("/api/gradehistory/search", () => {
      return HttpResponse.json(oneQuarterCourse, {
        status: 200,
      });
    }),
  ],
};
