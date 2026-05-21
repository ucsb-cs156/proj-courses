import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import EnrollmentHistorySearchForm from "main/components/BasicCourseSearch/EnrollmentHistorySearchForm";
import { useBackendMutation } from "main/utils/useBackend";
import ConvertedSectionTable from "main/components/Common/ConvertedSectionTable";

export default function EnrollmentHistoryIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  const [courseJSON, setCourseJSON] = useState([]);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/enrollmenthistory/search",
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
        <pre>{JSON.stringify(courseJSON, null, 2)}</pre>
      </div>
    </BasicLayout>
  );
}
