import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";
import BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { useBackendMutation } from "main/utils/useBackend";

export default function CourseDescriptionIndexPage() {
  const [courseJSON, setCourseJSON] = useState([]);
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
    const classes = courses.classes || [];
    setCourseJSON(classes);
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

  const showNoResultsMessage = hasSearched && courseJSON.length === 0;

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>UCSB Courses Description Search</h5>
        <BasicCourseSearchForm fetchJSON={fetchBasicCourseJSON} />
        {showNoResultsMessage && (
          <div className="alert alert-info text-center mt-3" role="alert">
            No courses found for the selected criteria.
          </div>
        )}
        <BasicCourseTable courses={courseJSON} />
      </div>
    </BasicLayout>
  );
}
