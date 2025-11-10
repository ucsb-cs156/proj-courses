import React from "react";

import UpdateCoursesByQuarterJobForm from "main/components/Jobs/UpdateCoursesByQuarterJobForm";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "components/Jobs/UpdateCoursesByQuarterJobForm",
  component: UpdateCoursesByQuarterJobForm,
};

const Template = (args) => {
  return <UpdateCoursesByQuarterJobForm {...args} />;
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
