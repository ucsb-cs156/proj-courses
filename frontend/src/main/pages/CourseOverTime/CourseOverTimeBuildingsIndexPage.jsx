import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseOverTimeBuildingsSearchForm from "main/components/BasicCourseSearch/CourseOverTimeBuildingsSearchForm";
import { useBackendMutation } from "main/utils/useBackend";
import ConvertedSectionTable from "main/components/Common/ConvertedSectionTable";

export default function CourseOverTimeBuildingsIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  const [courseJSON, setCourseJSON] = useState([]);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/courseovertime/buildingsearch",
    params: {
      startQtr: query.Quarter,
      endQtr: query.Quarter,
      buildingCode: query.buildingCode,
      classroom: query.classroom,
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
        <h5>UCSB Course History Search</h5>
        <CourseOverTimeBuildingsSearchForm
          fetchJSON={fetchCourseOverTimeJSON}
        />
        <ConvertedSectionTable sections={courseJSON} />
      </div>
    </BasicLayout>
  );
}
