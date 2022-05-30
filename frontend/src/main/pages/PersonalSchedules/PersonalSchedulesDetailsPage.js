import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import PersonalSchedulesTable from 'main/components/PersonalSchedules/PersonalSchedulesTable';
//import { toast } from "react-toastify";
//import PersonalScheduleForm from "main/components/PersonalSchedules/PersonalScheduleForm";
import { useBackend, _useBackendMutation } from "main/utils/useBackend";
//import { Navigate } from 'react-router-dom'

export default function PersonalSchedulesDetailsPage() {
  let { id } = useParams();

  const { data: personalSchedule, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/personalschedules?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/personalschedules?id=${id}`,
        params: {
          id
        }
      }
    );


//   const objectToAxiosPutParams = (personalSchedules) => ({
//     url: "/api/personalschedules",
//     method: "GET",
//     params: {
//       id: personalSchedules.id,
//     }
//   });

//   const mutation = useBackendMutation(
//     objectToAxiosPutParams,
//     // Stryker disable next-line all : hard to set up test for caching
//     [`/api/personalschedules?id=${id}`]
//   );

//  const { isSuccess } = mutation

//   if (isSuccess) {
//     return <Navigate to="/personalschedules/list" />
//   }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>PersonalSchedules Details</h1>
        {personalSchedule &&
                <PersonalSchedulesTable personalSchedules={[personalSchedule]} showButtons={false} />
            }
            <p>
                This is where the list of courses will go 
            </p>
      </div>
    </BasicLayout>
  )
}
