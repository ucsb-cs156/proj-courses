import React from "react";

import UpdateGradeInfoJobForm from "main/components/Jobs/UpdateGradeInfoForm";
import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

export default {
  title: "components/Jobs/UpdateGradeInfoForm",
  component: UpdateGradeInfoJobForm,
  parameters: {
    mockData: [
      {
        url: "/api/UCSBSubjects/all",
        method: "GET",
        status: 200,
        response: ucsbSubjectsFixtures.threeSubjects,
      },
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
  return <UpdateGradeInfoJobForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  callback: (data) => {
    console.log("Submit was clicked, data=", data);
  },
};
