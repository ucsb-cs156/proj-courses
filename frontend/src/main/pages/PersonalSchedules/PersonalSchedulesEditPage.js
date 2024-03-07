import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import PersonalScheduleForm from "main/components/PersonalSchedules/PersonalScheduleForm";
import { Navigate } from "react-router-dom";
import CourseTable from "main/components/Courses/CourseTable";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function PersonalSchedulesEditPage(storybook = false) {
  let { id } = useParams();

  const { data: personalSchedule, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ['/api/personalschedules?id=${id}'],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/personalschedules`,
        params: {
          id,
        },
      },
    );
  
  const objectToAxiosParams = (personalSchedule) => ({
    url: "/api/personalschedules",
    method: "PUT",
    params: {
      id: personalSchedule.id,
    },
    data: {
      user: personalSchedule.user,
      name: personalSchedule.name,
      description: personalSchedule.description,
      quarter: personalSchedule.quarter,
    }
  });

  const onSuccess = (personalSchedule) => {
    toast(
      `PersonalSchedule Updated - id: ${personalSchedule.id} name: ${personalSchedule.name}`,
    );
    console.log(personalSchedule.quarter);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/personalschedules/id=${id}"],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    const quarter = {
      quarter: localStorage["PersonalScheduleForm-quarter"],
    };
    console.log(quarter);
    const data2 = Object.assign(data, quarter);
    console.log(data2);
    mutation.mutate(data2);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/personalschedules/list" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
      <h1>Edit Personal Schedule</h1>
        {personalSchedule && (
          <PersonalScheduleForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialPersonalSchedule={personalSchedule}
          />
        )}
      </div>
    </BasicLayout>
  );
}
