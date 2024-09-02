import React from "react";

import UpdateCoursesJobForm from "main/components/Jobs/UpdateCoursesJobForm";
import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "components/Jobs/UpdateCoursesJobForm",
  component: UpdateCoursesJobForm,
};

const Template = (args) => {
  return <UpdateCoursesJobForm {...args} />;
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
    http.get("/api/UCSBSubjects/all", () => {
      return HttpResponse.json(ucsbSubjectsFixtures.threeSubjects, {
        status: 200,
      });
    }),
  ],
};
