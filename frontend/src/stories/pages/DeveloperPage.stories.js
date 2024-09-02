import React from "react";

import DeveloperPage from "main/pages/DeveloperPage";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "pages/DeveloperPage",
  component: DeveloperPage,
};

const Template = () => <DeveloperPage />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingBoth, {
        status: 200,
      });
    }),
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.adminUser, {
        status: 200,
      }); // returns 403 when not logged in
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
