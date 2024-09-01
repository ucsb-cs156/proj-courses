import React from "react";

import UpdateCoursesByQuarterRangeJobForm from "main/components/Jobs/UpdateCoursesByQuarterRangeJobForm";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "components/Jobs/UpdateCoursesByQuarterRangeJobForm",
  component: UpdateCoursesByQuarterRangeJobForm,
};

const Template = (args) => {
  return <UpdateCoursesByQuarterRangeJobForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  callback: (data) => {
    toast(`Submit was clicked, data=${JSON.stringify(data)}`);
  },
};
Default.parameters = {
  msw: [
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingBoth, {
        status: 200,
      });
    }),
  ],
};
