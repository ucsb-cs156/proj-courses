import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseForm from "main/components/Courses/CourseForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CoursesCreatePage() {

  const objectToAxiosParams = (course) => ({
    url: "/api/courses/post",
    method: "POST",
    params: {
      enrollCd: course.enrollCd,
      psId: course.psId,
      quarter: course.quarter
    }
  });

  const onSuccess = (course) => {
    toast(`New course Created - id: ${course.id} enrollCd: ${course.enrollCd}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/courses/user/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/courses/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Course</h1>

        <CourseForm submitAction={onSubmit}/>

      </div>
    </BasicLayout>
  )
}
