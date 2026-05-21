import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import EnrollmentHistorySearchForm from "main/components/BasicCourseSearch/EnrollmentHistorySearchForm";
import { useBackendMutation } from "main/utils/useBackend";

export default function EnrollmentHistoryIndexPage() {
  const [courseJSON, setCourseJSON] = useState([]);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/enrollmenthistory/search",
    // Stryker disable next-line StringLiteral : Axios defaults to GET, making this an equivalent mutant impossible to kill
    method: "GET",
    params: {
      yyyyq: query.quarter,
      subjectArea: query.subject,
      courseNumber: query.courseNumber + query.courseSuf,
    },
  });

  const onSuccess = (courses) => {
    setCourseJSON(courses);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [],
  );

  async function fetchEnrollmentHistoryJSON(_event, query) {
    mutation.mutate(query);
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>UCSB Enrollment History Search</h5>
        <EnrollmentHistorySearchForm fetchJSON={fetchEnrollmentHistoryJSON} />
        {/* Stryker disable next-line all : JSON formatting is not a functional requirement */}
        <pre>{JSON.stringify(courseJSON, null, 2)}</pre>
      </div>
    </BasicLayout>
  );
}
