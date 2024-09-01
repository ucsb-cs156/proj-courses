import React from "react";

import CourseOverTimeSearchForm from "main/components/BasicCourseSearch/CourseOverTimeSearchForm";
import { allTheSubjects } from "fixtures/subjectFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "components/BasicCourseSearch/CourseOverTimeSearch",
  component: CourseOverTimeSearchForm,
};

const Template = (args) => {
  return <CourseOverTimeSearchForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  submitText: "Create",
  fetchJSON: (_event, data) => {
    toast(`Submit was clicked, data=${JSON.stringify(data)}`);
  },
};
Default.parameters = {
  msw: [
    http.get("/api/UCSBSubjects/all", () => {
      return HttpResponse.json(allTheSubjects, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingBothStartAndEndQtr, {
        status: 200,
      });
    }),
  ],
};
