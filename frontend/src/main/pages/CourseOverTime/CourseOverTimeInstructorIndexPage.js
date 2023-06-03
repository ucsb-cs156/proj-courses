import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseOverTimeInstructorSearchForm from "main/components/BasicCourseSearch/CourseOverTimeInstructorSearchForm";
import { useBackendMutation } from "main/utils/useBackend";
import SectionsTable from "main/components/Sections/SectionsTable";

export default function CourseOverTimeInstructorIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  const [courseJSON, setCourseJSON] = useState([]);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/courseovertime/instructorsearch",
    params: {
      startQtr: query.startQuarter,
      endQtr: query.endQuarter,
      instructor: query.instructor,
    },
  });

  const onSuccess = (courses) => {
    setCourseJSON(courses);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    []
  );

  async function fetchCourseOverTimeJSON(_event, query) {
    mutation.mutate(query);
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>Welcome to the UCSB Course Instructor Search!</h5>
        <CourseOverTimeInstructorSearchForm fetchJSON={fetchCourseOverTimeJSON} />
        <SectionsTable sections={courseJSON} />
      </div>
    </BasicLayout>
  );
}