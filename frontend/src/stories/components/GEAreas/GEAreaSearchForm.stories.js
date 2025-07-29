import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import GEAreaSearchForm from "main/components/GEAreas/GEAreaSearchForm";
import { http, HttpResponse } from "msw";



// Default export with title, component, decorators and MSW mock
const meta = {
  title: "Components/GEAreas/GEAreaSearchForm",
  component: GEAreaSearchForm,
  decorators: [
    (StoryFn) => {
      const queryClient = new QueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <StoryFn />
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    msw: [
      // mock our GE-areas endpoint
      http.get("/api/public/generalEducationInfo", () => {
        return HttpResponse.json([
          {
            requirementCode: "A1",
            requirementTranslation: "English Reading & Composition",
            collegeCode: "ENGR",
            objCode: "BS",
            courseCount: 1,
            units: 4,
            inactive: false,
          },
          {
            requirementCode: "B",
            requirementTranslation: "Foreign Language - L&S",
            collegeCode: "L&S",
            objCode: "BA",
            courseCount: 1,
            units: 4,
            inactive: false,
          },
        ]);
      }),
      // mock systemInfo so startQtrYYYYQ/endQtrYYYYQ are always present
      http.get("/api/systemInfo", () => {
        return HttpResponse.json({
          startQtrYYYYQ: "20211",
          endQtrYYYYQ: "20253",
        });
      }),
    ],
  },
};

export default meta;

// “template” function for args
const Template = (args) => <GEAreaSearchForm {...args} />;

// In a real application, this function would make an API call to the backend
// Here, we just log the event and params to the console
const sampleFetchJSON = (event, params) => {
  window.alert(`fetchJSON called, event: ${event.type}, params: ${JSON.stringify(params)}`);
};

// Default story: logs the query params on submit
export const Default = Template.bind({});
Default.args = {
  fetchJSON: sampleFetchJSON
};

export const BackendRespondingAfter4secDelay = Template.bind({});
BackendRespondingAfter4secDelay.args = {
  fetchJSON: sampleFetchJSON
};
BackendRespondingAfter4secDelay.parameters = {
  msw: [
    http.get("/api/public/generalEducationInfo", async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      return HttpResponse.json([
        {
          requirementCode: "A1",
          requirementTranslation: "English Reading & Composition",
          collegeCode: "ENGR",
          objCode: "BS",
          courseCount: 1,
          units: 4,
          inactive: false,
        },
        {
          requirementCode: "B",
          requirementTranslation: "Foreign Language - L&S",
          collegeCode: "L&S",
          objCode: "BA",
          courseCount: 1,
          units: 4,
          inactive: false,
        },
      ]);
    }),
    // mock systemInfo so startQtrYYYYQ/endQtrYYYYQ are always present
    http.get("/api/systemInfo", () => {
      return HttpResponse.json({
        startQtrYYYYQ: "20211",
        endQtrYYYYQ: "20253",
      });
    }),
  ],
};


export const BackendNotResponding = Template.bind({});
BackendNotResponding.args = {
  fetchJSON: sampleFetchJSON
};
BackendNotResponding.parameters = {
  msw: [
    http.get("/api/public/generalEducationInfo", async () => {
      // Simulate no response by never resolving the promise
      return new Promise(() => {});
    }),
    // mock systemInfo so startQtrYYYYQ/endQtrYYYYQ are always present
    http.get("/api/systemInfo", () => {
      return HttpResponse.json({
        startQtrYYYYQ: "20211",
        endQtrYYYYQ: "20253",
      });
    }),
  ],
};


