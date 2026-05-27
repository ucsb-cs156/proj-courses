import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseOverTimeInstructorSearchForm from "main/components/BasicCourseSearch/CourseOverTimeInstructorSearchForm";
import { useBackendMutation } from "main/utils/useBackend";
import ConvertedSectionTable from "main/components/Common/ConvertedSectionTable";

export default function CourseOverTimeInstructorIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  const [courseJSON, setCourseJSON] = useState([]);
  // Stryker disable next-line all : Can't test state because hook is internal
  const [hasSearched, setHasSearched] = useState(false);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/courseovertime/instructorsearch",
    params: {
      startQtr: query.startQuarter,
      endQtr: query.endQuarter,
      instructor: query.instructor,
      lectureOnly: query.checkbox,
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
        <h5>UCSB Course Instructor Search</h5>
        <CourseOverTimeInstructorSearchForm
          fetchJSON={fetchCourseOverTimeJSON}
        />
        {mutation.isLoading && (
          <div className="text-center">Loading courses...</div>
        )}
        {!mutation.isLoading && hasSearched && courseJSON.length === 0 && (
          <div className="text-center mt-3">
            <p>No courses were found with the specified criteria.</p>
          </div>
        )}
        {!mutation.isLoading && courseJSON.length > 0 && (
          <ConvertedSectionTable sections={courseJSON} />
        )}
      </div>
    </BasicLayout>
  );
}
