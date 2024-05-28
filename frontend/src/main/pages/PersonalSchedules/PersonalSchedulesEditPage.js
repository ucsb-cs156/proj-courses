import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import PersonalScheduleForm from "main/components/PersonalSchedules/PersonalScheduleForm";
import CourseTable from "main/components/Courses/CourseTable";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import { useCurrentUser } from "main/utils/currentUser";
import { Button } from "react-bootstrap";

export default function PersonalSchedulesEditPage() {
  const createButton = () => {
    return (
      <Button variant="primary" href="/personalschedules/list" style={{}}>
        Back
      </Button>
    );
  };

  let { id } = useParams();
  const currentUser = useCurrentUser();

  const {
    data: personalSchedule,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/personalschedules?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/personalschedules`,
      params: {
        id,
      },
    },
  );

  const {
    data: courses,
    error: _PCerror,
    status: _PCstatus,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/courses/user/psid/all?psId=${id}`],
    {
      // Stryker disable next-line StringLiteral : GET is default, so replacing with "" is an equivalent mutation
      method: "GET",
      url: `/api/courses/user/psid/all?psId=${id}`,
    },
    [],
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
    },
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
    [`/api/personalschedules/id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess) {
    return <Navigate to="/personalschedules/list" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Personal Schedule</h1>
        {createButton()}
        {personalSchedule && (
          <PersonalScheduleForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialPersonalSchedule={personalSchedule}
          />
        )}
        <p className="py-5">
          <h1>Courses</h1>
          <CourseTable courses={courses} currentUser={currentUser} />
        </p>
      </div>
    </BasicLayout>
  );
}