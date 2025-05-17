import React from "react";
import PersonalSchedulesDetailsPage from "main/pages/PersonalSchedules/PersonalSchedulesDetailsPage";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";
import { toast } from "react-toastify";

export default {
  title: "pages/PersonalSchedules/PersonalSchedulesDetailsPage",
  component: PersonalSchedulesDetailsPage,
};

const Template = () => <PersonalSchedulesDetailsPage />;

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
        (schedule) => schedule.id === parseInt(id, 10)
      );
      return HttpResponse.json(
        schedule || { error: "Schedule not found" },
        {
          status: schedule ? 200 : 404,
        },
      );
    }),
    http.get("/api/personalSections/all", ({ url }) => {
      const params = new URL(url).searchParams;
      const psId = params.get("psId");
      if (psId) {
        const section = personalSectionsFixtures.threePersonalSections.find(
          (section) => section.id === parseInt(psId, 10)
        );
        if (section) {
          return HttpResponse.json(section, { status: 200 });
        } else {
          return HttpResponse.json({ error: "Section not found" }, { status: 404 });
        }
      } else {
        return HttpResponse.json(
          { error: "Missing psId query parameter" },
          { status: 400 }
        );
      }
    }),
  ],
};
