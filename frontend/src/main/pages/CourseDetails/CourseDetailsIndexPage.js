import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import _BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { useParams } from "react-router-dom";
import { useBackend, _useBackendMutation } from "main/utils/useBackend";
import CourseDetailsTable from "main/components/CourseDetails/CourseDetailsTable";
import { yyyyqToQyy } from "main/utils/quarterUtilities";
import CourseDescriptionTable from "main/components/Courses/CourseDescriptionTable";
import GradeHistoryGraphs from "main/components/GradeHistory/GradeHistoryGraph";

export default function CourseDetailsIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  let { qtr, enrollCode } = useParams();
  console.log("CourseDetailsIndexPage qtr", qtr);
  console.log("CourseDetailsIndexPage enrollCode", enrollCode);
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

  const courseId = moreDetails?.courseId.trim() || "";

  let subjectArea = "";
  let trimmedCourseNumber = "";

  // Splitting on two spaces allows for courses with multiple word subject areas (i.e. AS AM) to be recognized
  if (courseId) {
    const splitArray = courseId.split("  ");
    subjectArea = splitArray[0];
    trimmedCourseNumber = splitArray[splitArray.length - 1].trim();
  }

  // Fetch Grade History Data
  const { data: gradeHistory } = useBackend(
    [
      `/api/gradehistory/search?subjectArea=${subjectArea}&courseNumber=${trimmedCourseNumber}`,
    ],
    {
      method: "GET",
      url: "/api/gradehistory/search",
      params: {
        subjectArea: subjectArea,
        courseNumber: trimmedCourseNumber,
      },
    },
  );

  console.log("moreDetails", moreDetails);

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
        {gradeHistory && <GradeHistoryGraphs gradeHistory={gradeHistory} />}
      </div>
    </BasicLayout>
  );
}
