import React from "react";

import CourseOverTimeIndexPage from "main/pages/CourseOverTime/CourseOverTimeIndexPage";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";
import { oneQuarterCourse } from "fixtures/gradeHistoryFixtures";
import { threeSections } from "fixtures/sectionFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "pages/CourseOverTime/CourseOverTimeIndexPage",
  component: CourseOverTimeIndexPage,
};

const Template = () => <CourseOverTimeIndexPage />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingBoth, {
        status: 200,
      });
    }),
    http.get("/api/currentUser", () => {
      return HttpResponse.status(403); // returns 403 when not logged in
    }),
    http.get("/api/UCSBSubjects/all", () => {
      return HttpResponse.json(ucsbSubjectsFixtures.threeSubjects, {
        status: 200,
      });
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
    http.get("/api/public/courseovertime/search", ({ request }) => {
      toast(`Generated ${request.method} ${request.url}`);
      return HttpResponse.json(threeSections, {
        status: 200,
      });
    }),
  ],
};
