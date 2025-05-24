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

// Default story: logs the query params on submit
export const Default = Template.bind({});
Default.args = {
  fetchJSON: (_, params) => {
    console.log("Submitting search with", params);
  },
};
