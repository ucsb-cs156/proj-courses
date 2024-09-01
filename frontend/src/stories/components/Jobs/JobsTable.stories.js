import React from "react";

import JobsTable from "main/components/Jobs/JobsTable";
import jobsFixtures from "fixtures/jobsFixtures";
import systemInfoFixtures from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "components/Jobs/JobsTable",
  component: JobsTable,
};

const Template = (args) => {
  return <JobsTable {...args} />;
};

export const Empty = Template.bind({});
export const SixJobs = Template.bind({});

const mswhandlers = [
  http.get("/api/systemInfo", () => {
    return HttpResponse.json(systemInfoFixtures.showingBothStartAndEndQtr, {
      status: 200,
    });
  }),
];

Empty.args = {
  jobs: [],
  callback: (data) => {
    toast(`Submit was clicked, data=${JSON.stringify(data)}`);
  },
};
Empty.parameters = { msw: mswhandlers };

SixJobs.args = {
  jobs: jobsFixtures.sixJobs,
  callback: (data) => {
    toast(`Submit was clicked, data=${JSON.stringify(data)}`);
  },
};
SixJobs.parameters = { msw: mswhandlers };
