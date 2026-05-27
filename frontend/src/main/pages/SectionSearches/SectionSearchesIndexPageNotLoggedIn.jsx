import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";
import _BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { useBackendMutation } from "main/utils/useBackend";
import SectionsTable from "main/components/Sections/SectionsTable";

export default function SectionSearchesIndexPageNotLoggedIn() {
  const [sectionJSON, setSectionJSON] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/primaries",
    params: {
      qtr: query.quarter,
      dept: query.subject,
      level: query.level,
    },
  });

  const onSuccess = (section) => {
    setSectionJSON(section);
    setHasSearched(true);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [],
  );

  async function fetchBasicSectionJSON(_event, query) {
    mutation.mutate(query);
  }
  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>UCSB Courses Search</h5>
        <BasicCourseSearchForm fetchJSON={fetchBasicSectionJSON} />

        {/* Loading state */}
        {mutation.isLoading && (
          <div className="text-center">Loading courses...</div>
        )}

        {/* No results message */}
        {!mutation.isLoading && hasSearched && sectionJSON.length === 0 && (
          <div className="text-center mt-3">
            <p>No sections were found with the specified criteria.</p>
          </div>
        )}

        {!mutation.isLoading && sectionJSON.length > 0 && (
          <SectionsTable sections={sectionJSON} />
        )}
      </div>
    </BasicLayout>
  );
}
