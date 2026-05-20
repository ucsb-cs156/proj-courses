import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseOverTimeSearchForm from "main/components/BasicCourseSearch/CourseOverTimeSearchForm";
import { useBackendMutation } from "main/utils/useBackend";
import ConvertedSectionTable from "main/components/Common/ConvertedSectionTable";

export default function CourseOverTimeIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  const [courseJSON, setCourseJSON] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/courseovertime/search",
    params: {
      startQtr: query.startQuarter,
      endQtr: query.endQuarter,
      subjectArea: query.subject,
      courseNumber: query.courseNumber + query.courseSuf,
    },
  });

  const onSuccess = (courses) => {
    setCourseJSON(courses);
    setHasSearched(true);
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
        <CourseOverTimeSearchForm fetchJSON={fetchCourseOverTimeJSON} />
        {/* Loading state */}
        {mutation.isLoading && (
          <div className="text-center">Loading courses...</div>
        )}

        {/* No results message */}
        {!mutation.isLoading && hasSearched && courseJSON.length === 0 && (
          <div className="text-center mt-3">
            <p>No courses were found with the specified criteria.</p>
          </div>
        )}

        {/* Results table */}
        {!mutation.isLoading && courseJSON.length > 0 && (
          <ConvertedSectionTable sections={courseJSON} />
        )}
      </div>
    </BasicLayout>
  );
}
