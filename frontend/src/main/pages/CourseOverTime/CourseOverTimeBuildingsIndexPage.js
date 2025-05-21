import { useState, useEffect } from "react";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseOverTimeBuildingsSearchForm from "main/components/BasicCourseSearch/CourseOverTimeBuildingsSearchForm";
import { useBackendMutation } from "main/utils/useBackend";
import SectionsTable from "main/components/Sections/SectionsTable";

export default function CourseOverTimeBuildingsIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  const [courseJSON, setCourseJSON] = useState([]);
  // store fetched classroom numbers
  const [availableClassrooms, setAvailableClassrooms] = useState([]);
  // hold onto the latest query so we can trigger classroom fetch
  const [latestQuery, setLatestQuery] = useState({
    startQuarter: "",
    endQuarter: "",
    buildingCode: "",
  });

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

  // whenever buildingCode in our saved query changes, re-fetch classrooms
  useEffect(() => {
    if (!latestQuery.buildingCode) {
      setAvailableClassrooms([]);
      return;
    }
    classroomMutation.mutate(latestQuery);
  }, [latestQuery.buildingCode]);

  // fire the sections search AND save the query for useEffect
  async function fetchCourseOverTimeJSON(_event, query) {
    mutation.mutate(query);
    setLatestQuery({
      startQuarter: query.startQuarter,
      endQuarter: query.endQuarter,
      buildingCode: query.buildingCode,
    });
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>Welcome to the UCSB Course History Search!</h5>
        <CourseOverTimeBuildingsSearchForm
          fetchJSON={fetchCourseOverTimeJSON}
          availableClassrooms={availableClassrooms}
        />
        <SectionsTable
          sections={courseJSON.sort((a, b) =>
            b.courseInfo.quarter.localeCompare(a.courseInfo.quarter),
          )}
        />
      </div>
    </BasicLayout>
  );
}
