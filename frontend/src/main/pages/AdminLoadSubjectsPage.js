import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import React, { useEffect } from 'react';
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import UCSBSubjectsTable from "main/components/UCSBSubjects/UCSBSubjectsTable";

export default function AdminLoadSubjectsPage() {
  const {
    data: subjects,
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

  var subjectsCount = subjects.length;

  const onSuccessSubjects = (subjects) => {
    toast(`Number of Subjects Loaded : ${subjects.length - subjectsCount}`);
    console.log(`Number of Subjects Loaded : ${subjects.length - subjectsCount}`);

    subjectsCount = subjects.length;
  };

  const mutationSubjects = useBackendMutation(
    objectToAxiosParamsSubjects,
    { onSuccess: onSuccessSubjects },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/UCSBSubjects/all"],
  );
  useEffect(() => {
    // Fetch subjects when the component mounts
    mutationSubjects.mutate();
  }, []);

  const onSubmit = async (data) => {
    mutationSubjects.mutate(data);
  };

  return (
    <BasicLayout>
      <h2>Subjects</h2>
      <Button
        variant="primary"
        onClick={onSubmit}
        data-testid="AdminLoadSubjects-Load-Button"
      >
        Load Subjects
      </Button>
      <UCSBSubjectsTable subjects={subjects} />
    </BasicLayout>
  );
}
