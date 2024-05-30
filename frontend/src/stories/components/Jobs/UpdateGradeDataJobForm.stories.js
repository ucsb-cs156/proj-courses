import React from "react";
import UploadGradeDataJobForm from "main/components/Jobs/UploadGradeDataJobForm";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

export default {
  title: "components/Jobs/UploadGradeDataJobForm",
  component: UploadGradeDataJobForm,
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
  return <UploadGradeDataJobForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  callback: (data) => {
    console.log("Submit was clicked, data=", data);
  },
};
