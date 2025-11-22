import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";
import BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { useBackendMutation } from "main/utils/useBackend";

export default function CourseDescriptionIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  const [courseJSON, setCourseJSON] = useState([]);
  // Stryker disable next-line all : Can't test state because hook is internal
  const [hasSearched, setHasSearched] = useState(false);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/basicsearch",
    params: {
      qtr: query.quarter,
      dept: query.subject,
      level: query.level,
    },
  });

  const onSuccess = (courses) => {
    setCourseJSON(courses.classes);
    setHasSearched(true);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [],
  );

  async function fetchBasicCourseJSON(_event, query) {
    mutation.mutate(query);
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>UCSB Courses Description Search</h5>
        <BasicCourseSearchForm fetchJSON={fetchBasicCourseJSON} />
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
          <BasicCourseTable courses={courseJSON} />
        )}
      </div>
    </BasicLayout>
  );
}
