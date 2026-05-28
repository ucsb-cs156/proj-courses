import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import GEAreaSearchForm from "main/components/GEAreas/GEAreaSearchForm";
import GEAreaCoursesTable from "main/components/GEAreas/GEAreaCoursesTable";
import { useBackendMutation } from "main/utils/useBackend";

export default function GeneralEducationSearchPage() {
  const [courses, setCourses] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/primariesge",
    params: {
      qtr: query.quarter,
      area: query.area === "ALL" ? "" : query.area,
    },
  });

  const onSuccess = (courseResults) => {
    setCourses(courseResults);
    setHasSearched(true);
  };

  const mutation = useBackendMutation(objectToAxiosParams, { onSuccess }, []);

  const fetchGEAreaJSON = (_event, query) => {
    mutation.mutate(query);
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>UCSB General Education Search</h5>
        <GEAreaSearchForm fetchJSON={fetchGEAreaJSON} />

        {mutation.isLoading && (
          <div className="text-center">Loading courses...</div>
        )}

        {!mutation.isLoading && hasSearched && courses.length === 0 && (
          <div className="text-center mt-3">
            <p>No GE courses were found with the specified criteria.</p>
          </div>
        )}

        {!mutation.isLoading && courses.length > 0 && (
          <GEAreaCoursesTable courses={courses} />
        )}
      </div>
    </BasicLayout>
  );
}
