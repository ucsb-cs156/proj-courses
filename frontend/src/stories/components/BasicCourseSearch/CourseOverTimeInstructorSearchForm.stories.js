import React from "react";

import CourseOverTimeInstructorSearchForm from "main/components/BasicCourseSearch/CourseOverTimeInstructorSearchForm";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";


export default {
  title: "components/BasicCourseSearch/CourseOverTimeInstructorSearch",
  component: CourseOverTimeInstructorSearchForm,
  parameters: {
    mockData: [
      {
        url: '/api/systemInfo',
        method: 'GET',
        status: 200,
        response: systemInfoFixtures.showingBothStartAndEndQtr
      },
    ],
  },
};

const Template = (args) => {
  return <CourseOverTimeInstructorSearchForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  submitText: "Create",
  fetchJSON: (_event, data) => {
    console.log("Submit was clicked, data=", data);
  }
};
