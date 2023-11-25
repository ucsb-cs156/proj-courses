import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import _BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { useParams } from "react-router-dom";
import { useBackend, _useBackendMutation } from "main/utils/useBackend";
import CourseDetailsTable from "main/components/CourseDetails/CourseDetailsTable";
import { yyyyqToQyy } from "main/utils/quarterUtilities";

export default function CourseDetailsIndexPage() {
  // Stryker disable next-line all : Can't test state because hook is internal
  let { qyy, enrollcd } = useParams();
  const { data: moreDetails } = useBackend(
      // Stryker disable all : hard to test for query caching
      [`/api/sections/sectionsearch?qtr=${qyy}&enrollCode=${enrollcd}`],
      {
        method: "GET",
        url: `/api/sections/sectionsearch?qtr=${qyy}&enrollCode=${enrollcd}`,
        params: {
          qyy,
          enrollcd
        },
      },
    );
  console.log(moreDetails)

  // console.log('qtr:', qyy);
  // console.log('enrollCode:', enrollcd);
  
  return (
    <BasicLayout>
      <div className="pt-2">
      {moreDetails && moreDetails.courseId && (<h5>Course Details for {moreDetails.courseId} {yyyyqToQyy(qyy)}!</h5>)}
     
        {moreDetails && (
        <CourseDetailsTable details={[moreDetails]} />)}

      </div>
    </BasicLayout>
  );
}
