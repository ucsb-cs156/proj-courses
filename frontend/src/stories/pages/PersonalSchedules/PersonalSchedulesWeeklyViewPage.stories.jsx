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
    http.get("/api/personalschedules", ({ url }) => {
      const id = new URL(url).searchParams.get("id");
      const schedule = personalScheduleFixtures.onePersonalSchedule.find(
        (schedule) => schedule.id === id,
      );
      return HttpResponse.json(schedule || { error: "Schedule not found" }, {
        status: schedule ? 200 : 404,
      });
    }),
    http.get("/api/personalSections/all", ({ url }) => {
      const psId = new URL(url).searchParams.get("psId");
      const filteredSections =
        personalSectionsFixtures.threePersonalSections.filter(
          (section) => section.psId === psId,
        );
      return HttpResponse.json(filteredSections, {
        status: 200,
      });
    }),
  ],
};
