
import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";
import _BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { useBackendMutation } from "main/utils/useBackend";
import SectionsTable from "main/components/Sections/SectionsTable";

export default function SectionSearchesIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  const [sectionJSON, setSectionJSON] = useState([]);

  const objectToAxiosParams = (query) => ({
    url: "/api/sections/basicsearch",
    params: {
      qtr: query.quarter,
      dept: query.subject,
      level: query.level,
    },
  });

  const onSuccess = (section) => {
    console.log()
    setSectionJSON(section);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    []
  );

  async function fetchBasicSectionJSON(_event, query) {
    mutation.mutate(query);
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>Welcome to the UCSB Section Search App!</h5>
        <BasicCourseSearchForm fetchJSON={fetchBasicSectionJSON} />
        <SectionsTable sections={sectionJSON} />
      </div>
    </BasicLayout>
  );
}
