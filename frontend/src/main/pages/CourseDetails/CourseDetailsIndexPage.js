import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import _BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { useParams } from "react-router-dom";
import { useBackend, _useBackendMutation } from "main/utils/useBackend";
import CourseDetailsTable from "main/components/CourseDetails/CourseDetailsTable";
import { yyyyqToQyy } from "main/utils/quarterUtilities";
import CourseDescriptionTable from "main/components/Courses/CourseDescriptionTable";
import GradeHistoryTable from "main/components/GradeHistory/GradeHistoryTable";

export default function CourseDetailsIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  let { qtr, enrollCode } = useParams();
  const {
    data: moreDetails,
    _error,
    _status,
  } = useBackend(
    // Stryker disable all : hard to test for query caching
    [`/api/sections/sectionsearch?qtr=${qtr}&enrollCode=${enrollCode}`],
    {
      method: "GET",
      url: `/api/sections/sectionsearch`,
      params: {
        qtr,
        enrollCode,
      },
    },
  );

  const courseId = moreDetails?.courseId || '';

let trimmedCourse = '';
let trimmedCourseNumber = '';

if (courseId) {
  const [course, courseNumber] = courseId.split(/\s+/);
  trimmedCourse = course.trim();
  trimmedCourseNumber = courseNumber.trim();
}

  // Fetch Grade History Data
  const {
    data: gradeHistory,
  } = useBackend([`/api/gradehistory/search?subjectArea=${trimmedCourse}&courseNumber=${trimmedCourseNumber}`], 
  {
    method: "GET",
    url: "/api/gradehistory/search",
    params: {
      subjectArea: trimmedCourse,
      courseNumber: trimmedCourseNumber,
    },
  });

  return (
    <BasicLayout>
      <div className="pt-2">
        {moreDetails && moreDetails.courseId && (
          <h5>
            Course Details for {moreDetails.courseId} {yyyyqToQyy(qtr)}
          </h5>
        )}

        {moreDetails && <CourseDetailsTable details={[moreDetails]} />}
        {moreDetails && <CourseDescriptionTable course={moreDetails} />}
        {moreDetails && (
          <h5>
            Grade History for {moreDetails.courseId}
            </h5>
        )}
        {gradeHistory && <GradeHistoryTable details={gradeHistory} />}
      </div>
    </BasicLayout>
  );
}
