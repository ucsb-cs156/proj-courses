import { useState, useEffect } from "react";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseOverTimeBuildingsSearchForm from "main/components/BasicCourseSearch/CourseOverTimeBuildingsSearchForm";
import { useBackendMutation } from "main/utils/useBackend";
import SectionsTable from "main/components/Sections/SectionsTable";

export default function CourseOverTimeBuildingsIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  const [courseJSON, setCourseJSON] = useState([]);
  const [availableClassrooms, setAvailableClassrooms] = useState([]);
  const [latestQuery, setLatestQuery] = useState({
    startQuarter: "",
    endQuarter: "",
    buildingCode: "",
  });

  // — your existing “buildingsearch” mutation —
  const objectToAxiosParams = (q) => ({
    url: "/api/public/courseovertime/buildingsearch",
    params: {
      startQtr: q.startQuarter,
      endQtr: q.endQuarter,
      buildingCode: q.buildingCode,
    },
  });
  const onSuccess = (buildings) => setCourseJSON(buildings);
  const mutation = useBackendMutation(objectToAxiosParams, { onSuccess }, []);

  // — your “classrooms” mutation —
  const objectToAxiosParamsClassrooms = (q) => ({
    url: "/api/public/courseovertime/classrooms",
    params: {
      startQtr: q.startQuarter,
      endQtr: q.endQuarter,
      buildingCode: q.buildingCode,
    },
  });
  const classroomMutation = useBackendMutation(
    objectToAxiosParamsClassrooms,
    { onSuccess: (rooms) => setAvailableClassrooms(rooms) },
    [],
  );

  // <-- pull out exactly the bits our effect uses -->
  const { startQuarter, endQuarter, buildingCode } = latestQuery;
  const fetchClassrooms = classroomMutation.mutate;

  // effect now only depends on primitives + the stable fetchClassrooms fn
  useEffect(() => {
    if (!buildingCode) {
      setAvailableClassrooms([]);
      return;
    }
    fetchClassrooms({ startQuarter, endQuarter, buildingCode });
  }, [startQuarter, endQuarter, buildingCode, fetchClassrooms]);

  // single handler to run both API calls
  function fetchCourseOverTimeJSON(_e, query) {
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
        <SectionsTable
          sections={courseJSON.sort((a, b) =>
            b.courseInfo.quarter.localeCompare(a.courseInfo.quarter),
          )}
        />
      </div>
    </BasicLayout>
  );
}
