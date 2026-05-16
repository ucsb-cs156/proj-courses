import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import GEAreaSearchForm from "main/components/GEAreas/GEAreaSearchForm";
import { hasRole, useCurrentUser } from "main/utils/currentUser";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import SectionsTable from "main/components/Sections/SectionsTable";

const objectToAxiosParams = (query) => ({
  url: "/api/public/primariesge",
  params: {
    qtr: query.quarter,
    area: query.area === "ALL" ? "" : query.area,
  },
});

const LoggedInResults = ({ sectionJSON }) => {
  const {
    data: schedules,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/personalschedules/all"],
    { method: "GET", url: "/api/personalschedules/all" },
    [],
  );

  return (
    <SectionsTable
      sections={sectionJSON}
      schedules={schedules}
      includeGeneralEducation={true}
    />
  );
};

const LoggedOutResults = ({ sectionJSON }) => (
  <SectionsTable
    sections={sectionJSON}
    schedules={[]}
    includeGeneralEducation={true}
  />
);

export default function GeneralEducationSearchPage() {
  const { data: currentUser } = useCurrentUser();
  const [sectionJSON, setSectionJSON] = useState([]);

  const onSuccess = (section) => {
    setSectionJSON(section);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [],
  );

  async function fetchGESectionJSON(_event, query) {
    mutation.mutate(query);
  }

  const isLoggedIn = hasRole(currentUser, "ROLE_USER");

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>UCSB GE Search</h5>
        <GEAreaSearchForm fetchJSON={fetchGESectionJSON} />
        {isLoggedIn ? (
          <LoggedInResults sectionJSON={sectionJSON} />
        ) : (
          <LoggedOutResults sectionJSON={sectionJSON} />
        )}
      </div>
    </BasicLayout>
  );
}