import React from "react";

import PersonalSchedulesIndexPage from "main/pages/PersonalSchedules/PersonalSchedulesIndexPage";

import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "pages/PersonalSchedules/PersonalSchedulesIndexPage",
  component: PersonalSchedulesIndexPage,
};

const Template = () => <PersonalSchedulesIndexPage />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
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
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/personalschedules/all", () => {
      return HttpResponse.json(
        personalScheduleFixtures.threePersonalSchedules,
        {
          status: 200,
        },
      );
    }),
    http.delete("/api/personalschedules", ({ request }) => {
      toast(`Generated: ${request.method} ${request.url}`);
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
