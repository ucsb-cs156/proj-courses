import GeneralEducationSearchForm from "main/components/GeneralEducation/GeneralEducationSearchForm";
import { allTheAreas } from "fixtures/areaFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "components/GeneralEducation/GeneralEducationSearchForm",
  component: GeneralEducationSearchForm,
};

const Template = (args) => {
  return <GeneralEducationSearchForm {...args} />;
};

const mswHandlers = [
  http.get("/api/public/generalEducationInfo", () => {
    return HttpResponse.json(allTheAreas, {
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
  submitText: "Create",
  fetchJSON: (_event, data) => {
    toast(`Submit was clicked, data=${JSON.stringify(data)}`);
  },
};
Default.parameters = {
  msw: mswHandlers,
};
