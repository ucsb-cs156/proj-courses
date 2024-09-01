import React from "react";

import CourseOverTimeInstructorSearchForm from "main/components/BasicCourseSearch/CourseOverTimeInstructorSearchForm";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify"
import { http, HttpResponse } from "msw";

export default {
  title: "components/BasicCourseSearch/CourseOverTimeInstructorSearch",
  component: CourseOverTimeInstructorSearchForm
};

const Template = (args) => {
  return <CourseOverTimeInstructorSearchForm {...args} />;
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
}
