//TODO: Backend API?

import React from "react";

import CourseOverTimeSearchForm from "main/components/BasicCourseSearch/CourseOverTimeSearchForm";
import { allTheSubjects } from "fixtures/subjectFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

export default {
  title: "components/BasicCourseSearch/CourseOverTimeSearch",
  component: CourseOverTimeSearchForm,
  parameters: {
    mockData: [
      {
        url: "/api/UCSBSubjects/all",
        method: "GET",
        status: 200,
        response: allTheSubjects,
      },
      {
        url: "/api/systemInfo",
        method: "GET",
        status: 200,
        response: systemInfoFixtures.showingBothStartAndEndQtr,
      },
    ],
  },
};

const Template = (args) => {
  return <CourseOverTimeSearchForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  submitText: "Create",
  fetchJSON: (_event, data) => {
    console.log("Submit was clicked, data=", data);
  },
};
