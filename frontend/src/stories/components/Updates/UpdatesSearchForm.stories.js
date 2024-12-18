import UpdatesSearchForm from "main/components/Updates/UpdatesSearchForm";
import { allTheSubjects } from "fixtures/subjectFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { http, HttpResponse } from "msw";

export default {
  title: "components/Updates/UpdatesSearchForm",
  component: UpdatesSearchForm,
};

const Template = (args) => {
  return <UpdatesSearchForm {...args} />;
};

const mswHandlers = [
  http.get("/api/UCSBSubjects/all", () => {
    return HttpResponse.json(allTheSubjects, {
      status: 200,
    });
  }),
  http.get("/api/systemInfo", () => {
    return HttpResponse.json(systemInfoFixtures.showingBothStartAndEndQtr, {
      status: 200,
    });
  }),
];

export const Default = Template.bind({});
Default.args = {
  updateQuarter: (q) => {
    console.log(`updateQuarter: ${q}`);
  },
  updateSubjectArea: (s) => {
    console.log(`updateSubjectArea: ${s}`);
  },
  updateSortField: (s) => {
    console.log(`updateSortField: ${s}`);
  },
  updateSortDirection: (s) => {
    console.log(`updateSortDirection: ${s}`);
  },
};
Default.parameters = {
  msw: mswHandlers,
};
