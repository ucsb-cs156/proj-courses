import React from "react";
import SectionSearchesIndexpage from "main/pages/SectionSearches/SectionSearchesIndexPage";

import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { oneSection } from "fixtures/sectionFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

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
    http.get("/api/sections/basicsearch", ({ request }) => {
      toast(`Generating ${request.method} ${request.url}`);
      return HttpResponse.json(oneSection, {
        status: 200,
      });
    }),
  ],
};
