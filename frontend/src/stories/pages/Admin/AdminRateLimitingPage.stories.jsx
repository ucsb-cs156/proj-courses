import React from "react";

import AdminRateLimitingPage from "main/pages/Admin/AdminRateLimitingPage";

import { http, HttpResponse } from "msw";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import rateLimitedIPFixtures from "fixtures/rateLimitedIPFixtures";

export default {
  title: "pages/Admin/AdminRateLimitingPage",
  component: AdminRateLimitingPage,
};

const Template = () => <AdminRateLimitingPage />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/admin/rate-limited-ips", () => {
      return HttpResponse.json(rateLimitedIPFixtures.threeIPsPage, {
        status: 200,
      });
    }),
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
  ],
};
