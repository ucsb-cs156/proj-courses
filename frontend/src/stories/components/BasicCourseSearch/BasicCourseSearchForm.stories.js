import React from "react";

import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";
import { allTheSubjects } from "fixtures/subjectFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

export default {
  title: "components/BasicCourseSearch/BasicCourseSearchForm",
  component: BasicCourseSearchForm,
  parameters: {
    mockData: [
      {
        url: '/api/UCSBSubjects/all',
        method: 'GET',
        status: 200,
        response: allTheSubjects
      },
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
  return <BasicCourseSearchForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  submitText: "Create",
  fetchJSON: (_event, data) => {
    console.log("Submit was clicked, data=", data);
  }
};
