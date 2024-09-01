import CourseOverTimeSearchBuildingsForm from "main/components/BasicCourseSearch/CourseOverTimeBuildingsSearchForm";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify"
import { http, HttpResponse } from "msw";

export default {
  title: "components/BasicCourseSearch/CourseOverTimeBuildingsSearch",
  component: CourseOverTimeSearchBuildingsForm
};

const Template = (args) => {
  return <CourseOverTimeSearchBuildingsForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  fetchJSON: (_event, data) => {
    toast(`Submit was clicked, data=${JSON.stringify(data)}`);
  },
};
Default.parameters = {
  msw: [
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingBothStartAndEndQtr, {
        status: 200,
      });
    }),
  ],
};

