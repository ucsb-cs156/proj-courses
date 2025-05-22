import { useState, useEffect } from "react";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseOverTimeBuildingsSearchForm from "main/components/BasicCourseSearch/CourseOverTimeBuildingsSearchForm";
import { useBackendMutation } from "main/utils/useBackend";
import SectionsTable from "main/components/Sections/SectionsTable";

export default function CourseOverTimeBuildingsIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  const [courseJSON, setCourseJSON] = useState([]);
  // Stryker disable next-line all : Can't test state because hook is internal
  const [availableClassrooms, setAvailableClassrooms] = useState([]);
  // Stryker disable all : Can't test state because hook is internal
  const [latestQuery, setLatestQuery] = useState({
    startQuarter: "",
    endQuarter: "",
    buildingCode: "",
  });
  // Stryker restore all : Can't test state because hook is internal

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

  const objectToAxiosParamsClassrooms = (query) => ({
    url: "/api/public/courseovertime/classrooms",
    params: {
      startQtr: query.startQuarter,
      endQtr: query.endQuarter,
      buildingCode: query.buildingCode,
    },
  });
  const classroomMutation = useBackendMutation(
    objectToAxiosParamsClassrooms,
    { onSuccess: (rooms) => setAvailableClassrooms(rooms) },
    // Stryker disable next-line all : hard to set up test for caching
    [],
  );

  const { startQuarter, endQuarter, buildingCode } = latestQuery;
  const fetchClassrooms = classroomMutation.mutate;

  useEffect(() => {
    if (!buildingCode) {
      return;
    }
    fetchClassrooms({ startQuarter, endQuarter, buildingCode });
  }, [startQuarter, endQuarter, buildingCode, fetchClassrooms]);

  async function fetchCourseOverTimeJSON(_event, query) {
    mutation.mutate(query);
    setLatestQuery(query);
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>Welcome to the UCSB Course History Search!</h5>
        <CourseOverTimeBuildingsSearchForm
          fetchJSON={fetchCourseOverTimeJSON}
          availableClassrooms={availableClassrooms}
        />
        {/* TEST‐ONLY: expose classrooms for mutation tests, will be refactored once dropdown is implemented*/}
        <div data-testid="debug-classrooms">
          {JSON.stringify(availableClassrooms)}
        </div>
        <SectionsTable
          sections={courseJSON.sort((a, b) =>
            b.courseInfo.quarter.localeCompare(a.courseInfo.quarter),
          )}
        />
      </div>
    </BasicLayout>
  );
}
