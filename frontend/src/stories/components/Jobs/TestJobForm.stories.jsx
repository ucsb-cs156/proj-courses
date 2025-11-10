import React from "react";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";
import TestJobForm from "main/components/Jobs/TestJobForm";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

export default {
  title: "components/Jobs/TestJobForm",
  component: TestJobForm,
};

const Template = (args) => {
  return <TestJobForm {...args} />;
};

export const Empty = Template.bind({});

const mswhandlers = [
  http.get("/api/systemInfo", () => {
    return HttpResponse.json(systemInfoFixtures.showingBothStartAndEndQtr, {
      status: 200,
    });
  }),
];

Empty.args = {
  jobs: [],
  submitAction: (data) => {
    toast(`Submit was clicked, data=${JSON.stringify(data)}`);
  },
};
Empty.parameters = { msw: mswhandlers };
