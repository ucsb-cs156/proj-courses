import CourseOverTimeBuildingsSearchForm from "main/components/BasicCourseSearch/CourseOverTimeBuildingsSearchForm";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "components/BasicCourseSearch/CourseOverTimeBuildingsSearchForm",
  component: CourseOverTimeBuildingsSearchForm,
};

const Template = (args) => {
  return <CourseOverTimeBuildingsSearchForm {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  fetchJSON: (_event, data) => {
    toast(`Submit was clicked, data=${JSON.stringify(data)}`);
  },
};

Default.parameters = {
  msw: [
    // Mock system info for quarters
    http.get("/api/systemInfo", () =>
      HttpResponse.json(systemInfoFixtures.showingBothStartAndEndQtr),
    ),

    // Mock classroom data when quarter and buildingCode are provided
    http.get(
      "/api/public/courseovertime/buildingsearch/classrooms",
      ({ request }) => {
        const url = new URL(request.url);
        const quarter = url.searchParams.get("quarter");
        const buildingCode = url.searchParams.get("buildingCode");

        if (quarter && buildingCode) {
          return HttpResponse.json(["101", "102"]);
        }

        return HttpResponse.json([]);
      },
    ),
  ],
};
