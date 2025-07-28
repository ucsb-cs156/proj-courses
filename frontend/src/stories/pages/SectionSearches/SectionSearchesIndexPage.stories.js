import React from "react";
import SectionSearchesIndexpage from "main/pages/SectionSearches/SectionSearchesIndexPage";

import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";
import primaryFixtures from "fixtures/primaryFixtures";

export default {
  title: "pages/SectionSearches/SectionSearchesIndexPage",
  component: SectionSearchesIndexpage,
};

const Template = () => <SectionSearchesIndexpage />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/UCSBSubjects/all", () => {
      return HttpResponse.json(ucsbSubjectsFixtures.threeSubjects, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingBoth, {
        status: 200,
      });
    }),
    http.get("/api/currentUser", () => {
      return HttpResponse.status(403); // returns 403 when not logged in
    }),
    http.get("/api/sections/primaries", ({ request }) => {
      toast(`Generating ${request.method} ${request.url}`);
      return HttpResponse.json(primaryFixtures.f24_math_lowerDiv, {
        status: 200,
      });
    }),
  ],
};
