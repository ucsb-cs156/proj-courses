import React from "react";

import PersonalSchedulesEditPage from "main/pages/PersonalSchedules/PersonalSchedulesEditPage";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "pages/PersonalSchedules/PersonalSchedulesEditPage",
  component: PersonalSchedulesEditPage,
};

const Template = () => <PersonalSchedulesEditPage />;

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
    http.get("/api/personalschedules", () => {
      return HttpResponse.json(
        personalScheduleFixtures.onePersonalSchedule[0],
        {
          status: 200,
        },
      );
    }),
    http.put("/api/personalschedules", ({ request }) => {
      request.json().then((body) => {
        toast(
          `Generated: ${request.method} ${request.url} with body: ${JSON.stringify(body)}`,
        );
      });
      return HttpResponse.json(
        {},
        {
          status: 200,
        },
      );
    }),
  ],
};
