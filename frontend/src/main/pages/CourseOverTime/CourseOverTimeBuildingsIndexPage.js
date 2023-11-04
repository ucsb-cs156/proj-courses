import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseOverTimeBuildingsSearchForm from "main/components/BasicCourseSearch/CourseOverTimeBuildingsSearchForm";
import { useBackendMutation } from "main/utils/useBackend";
import SectionsTable from "main/components/Sections/SectionsTable";

export default function CourseOverTimeBuildingsIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  const [courseJSON, setCourseJSON] = useState([]);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/courseovertime/buildingsearch",
    params: {
      startQtr: query.startQuarter,
      endQtr: query.endQuarter,
      buildingCode: query.buildingCode,
    },
  });

  const onSuccess = (buildings) => {
    setCourseJSON(buildings);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [],
  );

  async function fetchCourseOverTimeJSON(_event, query) {
    mutation.mutate(query);
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>Welcome to the UCSB Course History Search!</h5>
        <CourseOverTimeBuildingsSearchForm
          fetchJSON={fetchCourseOverTimeJSON}
        />
        <SectionsTable sections={courseJSON} />
      </div>
    </BasicLayout>
  );
}
