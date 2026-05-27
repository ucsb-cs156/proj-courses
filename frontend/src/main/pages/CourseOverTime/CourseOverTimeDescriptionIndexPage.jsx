import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseOverTimeDescriptionSearchForm from "main/components/BasicCourseSearch/CourseOverTimeDescriptionSearchForm";
import { useBackendMutation } from "main/utils/useBackend";
import ConvertedSectionTable from "main/components/Common/ConvertedSectionTable";

export default function CourseOverTimeDescriptionIndexPage() {
  const [courseJSON, setCourseJSON] = useState([]);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/description/search",
    params: {
      startQtr: query.startQuarter,
      endQtr: query.endQuarter,
      searchTerms: query.searchTerms,
      lectureOnly: query.lectureOnly,
    },
  });

  const onSuccess = (courses) => {
    setCourseJSON(courses);
  };

  const mutation = useBackendMutation(objectToAxiosParams, { onSuccess }, []);

  async function fetchCourseOverTimeJSON(_event, query) {
    mutation.mutate(query);
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>UCSB Course Description Search</h5>
        <p>
          Search for courses by entering terms that will be searched in the
          course title and description across a range of quarters.
        </p>
        <CourseOverTimeDescriptionSearchForm
          fetchJSON={fetchCourseOverTimeJSON}
        />
        <ConvertedSectionTable sections={courseJSON} />
      </div>
    </BasicLayout>
  );
}
