import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useBackendMutation, useBackend } from "main/utils/useBackend";
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
    { method: "GET", url: "/api/UCSBSubjects/all" },
    [],
  );

  const objectToAxiosParams = () => ({
    url: "/api/UCSBSubjects/load",
    method: "POST",
  });

  var subjectsCount = subjects.length;

  const onSuccess = (subjects) => {
    toast(`Number of Subjects Loaded : ${subjects.length - subjectsCount}`);
    subjectsCount = subjects.length;
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/UCSBSubjects/all"],
  );

  const onSubmit = async (data) => {
    mutation.mutate(data);
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
