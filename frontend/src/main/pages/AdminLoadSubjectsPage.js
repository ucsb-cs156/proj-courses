import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Navigate } from "react-router-dom";
import { useBackendMutation, useBackend } from "main/utils/useBackend";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import UCSBSubjectsTable from 'main/components/UCSBSubjects/UCSBSubjectsTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function AdminLoadSubjectsPage() {                     //NOT DONE
  const objectToAxiosParams = () => ({
    url: "/api/UCSBsubjects/post",
    method: "POST",
  });
//delete things marked with this [***] after

//[***] 
const currentUser = useCurrentUser();
const { data: subjects, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/UCSBsubjects/all"],
      { method: "GET", url: "/api/UCSBsubjects/all" },
      []
    );
//[***]


  const onSuccess = () => {
    toast(
      `The amount of new Subjects Created : ${ucsbSubject.length}`
    );
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/UCSBsubjects/retrieve"]
  );

//if(ucsbSubject.length>0){
  


  const { isSuccess } = mutation

  const onSubmit = async () => {
    mutation.mutate();
  }

  if (isSuccess) {
    window.location.reload();
    //return <Navigate to="/admin/loadsubjects" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Load Subjects</h1>
  
        <button onclick="onSubmit()">Refresh the Table</button>

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

          <Button
            variant='primary'
            onClick={update()}
            data-testid="update_Admin_LoadSubjPage"
          >
            Update
          </Button>
        </p>
      </div>
    </BasicLayout>
  )
}


*/