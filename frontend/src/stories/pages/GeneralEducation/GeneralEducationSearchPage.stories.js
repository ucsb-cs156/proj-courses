import React from "react";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/GeneralEducationSearchPage";

import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { generalEducationAreasFixtures } from "fixtures/generalEducationAreasFixtures";
import { sectionsFixtures } from "fixtures/sectionsFixtures";

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
      return HttpResponse.json(systemInfoFixtures.showingBoth);
    }),
    http.get("/api/currentUser", () => {
      return HttpResponse.status(403);
    }),
    http.get("/api/public/generalEducationInfo", () => {
      return HttpResponse.json(generalEducationAreasFixtures.areas);
    }),
    http.get("/api/sections/generaleducationsearch", ({ request }) => {
      return HttpResponse.json([]);
    }),
  ],
};

export const WithResults = Template.bind({});
WithResults.parameters = {
  msw: [
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingBoth);
    }),
    http.get("/api/currentUser", () => {
      return HttpResponse.status(403);
    }),
    http.get("/api/public/generalEducationInfo", () => {
      return HttpResponse.json(generalEducationAreasFixtures.areas);
    }),
    // Mock for the search results to show a populated table
    http.get("/api/sections/generaleducationsearch", ({ request }) => {
      return HttpResponse.json(sectionsFixtures.threeSections);
    }),
  ],
};
