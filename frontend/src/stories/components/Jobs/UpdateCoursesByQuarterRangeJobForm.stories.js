import React from "react";

import UpdateCoursesByQuarterRangeJobForm from "main/components/Jobs/UpdateCoursesByQuarterRangeJobForm";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

export default {
  title: "components/Jobs/UpdateCoursesByQuarterRangeJobForm",
  component: UpdateCoursesByQuarterRangeJobForm,
  parameters: {
    mockData: [
      {
        url: "/api/systemInfo",
        method: "GET",
        status: 200,
        response: systemInfoFixtures.showingBoth,
      },
    ],
  },
};

const Template = (args) => {
  return <UpdateCoursesByQuarterRangeJobForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  callback: (data) => {
    console.log("Submit was clicked, data=", data);
  },
};
