import React from "react";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/GeneralEducationSearchPage";

import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { http, HttpResponse } from "msw";

export default {
  title: "pages/GeneralEducation/GeneralEducationSearchPage",
  component: GeneralEducationSearchPage,
};

const Template = () => <GeneralEducationSearchPage />;

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
  ],
};
