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


//delete things marked with this [***] after testing it out
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
