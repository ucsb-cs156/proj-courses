import React from "react";
import AdminLoadSubjectsPage from "main/pages/AdminLoadSubjectsPage";
import jobsFixtures from "fixtures/jobsFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "pages/Admin/AdminLoadSubjectsPage",
  component: AdminLoadSubjectsPage,
};

const Template = () => <AdminLoadSubjectsPage />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/UCSBSubjects/all", () => {
      return HttpResponse.json(ucsbSubjectsFixtures.threeSubjects, {
        status: 200,
      });
    }),
    http.post("/api/UCSBSubjects/load", ({ request }) => {
      toast(`Generated: ${request.method} ${request.url}`);
      return HttpResponse.json(ucsbSubjectsFixtures.threeSubjects, {
        status: 200,
      });
    }),
    http.get("/api/jobs/all", () => {
      return HttpResponse.json(jobsFixtures.sixJobs, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingBoth, {
        status: 200,
      });
    }),
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.adminUser, {
        status: 200,
      });
    }),
    http.post("/logout", ({ request }) => {
      toast(`Generated: ${request.method} ${request.url}`);
      return HttpResponse.json(
        {},
        {
          status: 200,
        },
      );
    }),
  ],
};
