import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import _BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { useParams } from "react-router-dom";
import { useBackend, _useBackendMutation } from "main/utils/useBackend";
import CourseDetailsTable from "main/components/CourseDetails/CourseDetailsTable";
import { yyyyqToQyy } from "main/utils/quarterUtilities";
import CourseDescriptionTable from "main/components/Courses/CourseDescriptionTable";
import CourseGradeDistTable from "main/components/CourseGradeDist/CourseGradeDistTable";
import { parseCourseId } from "main/utils/CoursesUtils";
import { Fragment } from "react";

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

  // Parse the subject area and course number, if moreDetails undefined, just leave them blank
  let subjectArea = "",
    courseNumber = "";
  if (moreDetails) {
    ({ subjectArea, courseNumber } = parseCourseId(moreDetails.courseId));
  }
  // Will return grade data or an empty array if moreDetails undefined
  let {
    data: gradeData,
    _error1,
    _status1,
  } = useBackend(
    // Stryker disable all : hard to test for query caching
    [
      `/api/gradehistory/search?subjectArea=${subjectArea}&courseNumber=${courseNumber}`,
    ],
    {
      method: "GET",
      url: `/api/gradehistory/search`,
      params: {
        subjectArea,
        courseNumber,
      },
    },
  );

  // Stryker restore all
  if (gradeData === undefined) {
    gradeData = [];
  }

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
        {moreDetails ? (
          <Fragment>
            <h5>Course Grade Distribution for {moreDetails.courseId}</h5>
            <CourseGradeDistTable gradeData={gradeData} />
          </Fragment>
        ) : (
          <h5>No Course Grade Distribution Available</h5>
        )}
      </div>
    </BasicLayout>
  );
}
