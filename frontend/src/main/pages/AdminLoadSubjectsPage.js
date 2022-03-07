import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
//import UCSBSubjectForm from "main/components/UCSBSubjects/UCSBSubjectForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { useCurrentUser } from "main/utils/currentUser";

export default function AdminLoadSubjectsPage() {                     //NOT DONE
  const currentUser = useCurrentUser();

  const { data: subjects, error: _error, status: _status } =
  useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/ucsbsubjects/all"],
    { method: "GET", url: "/api/ucsbsubjects/all" },
    []
  );


  const onSuccess = (ucsbSubject) => {
    toast(
      `The amount of new Subjects Created : ${ucsbSubject.id}`
    );
  };
  
  /*                                                    //trying out these
    const mutation = useBackendMutation(
      objectToAxiosParams,
      { onSuccess },
      // Stryker disable next-line all : hard to set up test for caching
      ["/api/ucsbsubjects/all"]
    );
  
    const { isSuccess } = mutation;
  
    const onSubmit = async (data) => {
      mutation.mutate(data);
    };
  
    if (isSuccess) {
      return <Navigate to="/ucsbsubjects/list" />;
    }
  
  function update() {
    reload = location.reload();
  }
  
  
  
          <Button
            variant='primary'
            onClick={update()}
            data-testid="update_Admin_LoadSubjPage"
          >
            Update
          </Button>
  
  
  */
  //get new list, get old - find delta. could loop through new set and see if in table if not

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Load Subjects</h1>
        <UCSBSubjectsTable subjects={subjects} currentUser={currentUser} />
        <p>
        <input type="button" value = "Refresh" onclick="history.go(0)" />
        </p>
      </div>
    </BasicLayout>
  )
}

