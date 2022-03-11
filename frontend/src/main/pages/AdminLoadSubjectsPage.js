import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useBackendMutation, useBackend } from "main/utils/useBackend";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import UCSBSubjectsTable from 'main/components/UCSBSubjects/UCSBSubjectsTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function AdminLoadSubjectsPage() {                     
  
  const currentUser = useCurrentUser();
  const { data: subjects, error: _error, status: _status } =
      useBackend(
        // Stryker disable next-line all : don't test internal caching of React Query
        ["/api/UCSBSubjects/all"], { method: "GET", url: "/api/UCSBSubjects/all" }, []
      );

  const objectToAxiosParams = () => ({
    url: "/api/UCSBSubjects/load",
    method: "POST",
  });


  const onSuccess = () => {
    //Todo: Toast should say how much new subjects were loaded in, not just number of subjects loaded in
    toast(
      `Number of Subjects Loaded : ${subjects.length}`
    );
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/UCSBSubjects/all"]
  );

  

  const onSubmit = async () => {
    mutation.mutate();
  }


  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Load Subjects</h1>
  
        <Button variant = 'primary' onClick={onSubmit}>Refresh the Table</Button>
        <UCSBSubjectsTable subjects={subjects} currentUser={currentUser} />


      </div>
    </BasicLayout>
  );
}




/*                                                   //trying out these
<UCSBSubjectsTable subjects={subjects} currentUser={currentUser} />
//works but with table the page disapears after a second
<input type="button" value="Refresh" onclick="onSubmit()" />
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
    //get new list, get old - find delta. could loop through new set and see if in table if not
   */

/*
 <Button
          variant='primary'
          onClick={onSubmit()}
          data-testid="update_Admin_LoadSubjPage"
        >
          Update
        </Button>
        <input type="button" value="Refresh" onclick="history.go(0)" />
<submitAction={onSubmit} />
return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Load Subjects</h1>
        <p>
          This is where the Load Subjects page will go
        </p>
      </div>
    </BasicLayout>
  )
}
*/
