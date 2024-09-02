import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "layouts/BasicLayout/BasicLayout",
  component: BasicLayout,
};

const Template = () => <BasicLayout />;

export const LoggedOut = Template.bind({});
LoggedOut.parameters = {
  msw: [
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
  ],
};

export const LoggedOutShowingH2AndSwagger = Template.bind({});
LoggedOutShowingH2AndSwagger.parameters = {
  msw: [
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingBoth, {
        status: 200,
      });
    }),
  ],
};

export const LoggedInUser = Template.bind({});
LoggedInUser.parameters = {
  msw: [
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
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

export const LoggedInAdmin = Template.bind({});
LoggedInAdmin.parameters = {
  msw: [
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
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
