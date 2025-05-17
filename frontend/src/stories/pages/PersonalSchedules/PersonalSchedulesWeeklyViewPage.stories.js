import React from "react";
import PersonalSchedulesWeeklyViewPage from "main/pages/PersonalSchedules/PersonalSchedulesWeeklyViewPage";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";
import { toast } from "react-toastify";

export default {
  title: "pages/PersonalSchedules/PersonalSchedulesWeeklyViewPage",
  component: PersonalSchedulesWeeklyViewPage,
};

const Template = () => <PersonalSchedulesWeeklyViewPage />;

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
    http.get("/api/personalSections/all", () => {
      return HttpResponse.json(personalSectionsFixtures.threePersonalSections, {
        status: 200,
      });
    }),
  ],
};
