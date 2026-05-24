import React from "react";

import CourseOverTimeDescriptionSearchForm from "main/components/BasicCourseSearch/CourseOverTimeDescriptionSearchForm";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "components/BasicCourseSearch/CourseOverTimeDescriptionSearch",
  component: CourseOverTimeDescriptionSearchForm,
};

const Template = (args) => {
  return <CourseOverTimeDescriptionSearchForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  fetchJSON: (_event, data) => {
    toast(`Submit was clicked, data=${JSON.stringify(data)}`);
  },
};
Default.parameters = {
  msw: [
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingBothStartAndEndQtr, {
        status: 200,
      });
    }),
  ],
};

export const SystemInfoNotAvailable = Template.bind({});

SystemInfoNotAvailable.args = {
  fetchJSON: (_event, data) => {
    toast(`Submit was clicked, data=${JSON.stringify(data)}`);
  },
};
SystemInfoNotAvailable.parameters = {
  msw: [
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(
        {},
        {
          status: 400,
        },
      );
    }),
  ],
};
