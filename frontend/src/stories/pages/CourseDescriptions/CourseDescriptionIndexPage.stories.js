import React from "react";

import CourseDescriptionIndexPage from "main/pages/CourseDescriptions/CourseDescriptionIndexPage";
import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { coursesFixtures } from "fixtures/courseFixtures";

import { http, HttpResponse } from "msw";

export default {
  title: "pages/CourseDescriptionIndexPage/CourseDescriptionIndexPage",
  component: CourseDescriptionIndexPage,
};

const Template = () => <CourseDescriptionIndexPage />;

export const Default = Template.bind({});
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
    http.get("/api/public/basicsearch", () => {
      return HttpResponse.json(
        { classes: coursesFixtures.oneCourse },
        {
          status: 200,
        },
      );
    }),
  ],
};
