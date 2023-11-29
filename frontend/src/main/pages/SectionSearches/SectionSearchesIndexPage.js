import { useState } from "react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";
import _BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
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
    setSectionJSON(section);
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

  const {
    data: _subjects,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/UCSBSubjects/all"],
    // Stryker disable next-line all : stryker changing "GET" to "" does nothing; "get" is the default method
    { method: "GET", url: "/api/UCSBSubjects/all" },
    [],
  );

  const objectToAxiosParamsSubjects = () => ({
    url: "/api/UCSBSubjects/load",
    method: "POST",
  });

  const onSuccessSubjects = (subjects) => {
    toast(`Number of Subjects Loaded : ${subjects.length}`);
  };

  const mutationSubjects = useBackendMutation(
    objectToAxiosParamsSubjects,
    { onSuccess: onSuccessSubjects },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/UCSBSubjects/all"],
  );

  //not sure how to mutation test for empty dependency list
  // Stryker disable all
  useEffect(() => {
    mutationSubjects.mutate();
    //not sure how to get around eslint for an empty dependency
    //list since I have to make it empty to only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Stryker restore all

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>Welcome to the UCSB Courses Search App!</h5>
        <BasicCourseSearchForm fetchJSON={fetchBasicSectionJSON} />
        <SectionsTable sections={sectionJSON} />
      </div>
    </BasicLayout>
  );
}
