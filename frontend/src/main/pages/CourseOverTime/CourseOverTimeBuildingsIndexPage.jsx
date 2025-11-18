import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseOverTimeBuildingsSearchForm from "main/components/BasicCourseSearch/CourseOverTimeBuildingsSearchForm";
import { useBackendMutation } from "main/utils/useBackend";
import ConvertedSectionTable from "main/components/Common/ConvertedSectionTable";

export default function CourseOverTimeBuildingsIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  const [courseJSON, setCourseJSON] = useState([]);
  // Stryker disable next-line all : Can't test state because hook is internal
  const [selectedClassroom, setSelectedClassroom] = useState("ALL");

  const objectToAxiosParams = (query) => ({
    url: "/api/public/courseovertime/buildingsearch",
    params: {
      startQtr: query.Quarter,
      endQtr: query.Quarter,
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
    // Stryker disable all
    /* istanbul ignore next */
    setSelectedClassroom(query.classroom || "ALL");
    // Stryker restore all
    mutation.mutate(query);
  }

  const filteredSections =
    !selectedClassroom || selectedClassroom === "ALL"
      ? courseJSON
      : courseJSON.filter(
          (cs) =>
            cs.section &&
            cs.section.timeLocations &&
            cs.section.timeLocations.some(
              (loc) => loc.room === selectedClassroom,
            ),
        );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>UCSB Course History Search</h5>
        <CourseOverTimeBuildingsSearchForm
          fetchJSON={fetchCourseOverTimeJSON}
        />
        <ConvertedSectionTable sections={filteredSections} />
      </div>
    </BasicLayout>
  );
}
