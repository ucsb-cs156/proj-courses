import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import {UCSBSubjectsTable} from "src/main/components/UCSBSubjects/UCSBSubjectsTable.js"

export default function AdminLoadSubjectsPage() {                     //NOT DONE
  const objectToAxiosParams = () => ({
    url: "/api/ucsbsubjects/post",
    method: "POST",
  });

  const onSuccess = (ucsbSubject) => {
    toast(
      `The amount of new Subjects Created : ${ucsbSubject.length}`
    );
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/ucsbsubjects/retrieve"]
  );


  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/admin/loadsubjects" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Load Subjects</h1>
        <UCSBSubjectsTable subjects={subjects} currentUser={currentUser} />
        <input type="button" value="Refresh" onclick="onSubmit()" />

      </div>
    </BasicLayout>
  );
}




/*                                                   //trying out these
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