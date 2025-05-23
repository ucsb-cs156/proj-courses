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
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingBoth),
    ),
    http.get("/api/currentUser", () => HttpResponse.status(403)),
    http.get("/api/public/generalEducationInfo", () => {
      return HttpResponse.json(generalEducationAreasFixtures.areas);
    }),
    http.get(
      "/api/sections/generaleducationsearch",
      ({ request: _request }) => {
        return HttpResponse.json([]);
      },
    ),
  ],
};

export const WithResults = Template.bind({});
WithResults.parameters = {
  msw: [
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingBoth),
    ),
    http.get("/api/currentUser", () => HttpResponse.status(403)),
    http.get("/api/public/generalEducationInfo", () => {
      return HttpResponse.json(generalEducationAreasFixtures.areas);
    }),
    http.get(
      "/api/sections/generaleducationsearch",
      ({ request: _request }) => {
        // Use a predefined small set from your fixtures
        return HttpResponse.json(sectionsFixtures.oneSection); // Or sectionsFixtures.threeSections
      },
    ),
  ],
};

export const DropdownApiError = Template.bind({});
DropdownApiError.parameters = {
  msw: [
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingBoth),
    ),
    http.get("/api/currentUser", () => HttpResponse.status(403)),
    http.get("/api/public/generalEducationInfo", () => {
      return HttpResponse.json(null, { status: 500 });
    }),
    http.get(
      "/api/sections/generaleducationsearch",
      ({ request: _request }) => {
        return HttpResponse.json([]);
      },
    ),
  ],
};
