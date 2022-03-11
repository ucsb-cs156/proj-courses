import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useState } from "react";
import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";
import { useBackendMutation } from "main/utils/useBackend";
import { queryAllByTestId } from "@testing-library/react";
import { toast } from "react-toastify";

export default function HomePage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  const [courseJSON, setCourse] = useState([]);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/basicsearch",
    //Removed the "method: "GET"" statement that was here because the API call still goes through even without it and mutation testing was failing for it
    params: {
      qtr: query.quarter,
      dept: query.subject,
      level: query.level,
    },
  });

  const onSuccess = (courses) => {
    //Toast only in place while Table component has not been added to the page
    //The toast helps us test that the correct input has been received
    //After the table component has been added, we can directly check whether the table has the received result
    toast(courses.classes.length + " Courses Retrieved");
    return courses.classes;
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    []
  );

  async function fetchBasicCourseJSON(event, query) {
    mutation.mutate(query);
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>Welcome to the UCSB Courses Search App!</h5>
        <BasicCourseSearchForm
          setCourseJSON={setCourse}
          fetchJSON={fetchBasicCourseJSON}
        />
      </div>
    </BasicLayout>
  );
}
