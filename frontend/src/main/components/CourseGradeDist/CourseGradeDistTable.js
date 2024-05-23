import OurTable from "../OurTable";
import { fromFormat } from "main/utils/quarterUtilities";

// eslint-disable-next-line no-unused-vars
export default function CourseGradeDistTable({ gradeData }) {
  const columns = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Session",
      accessor: "session",
    },
    {
      Header: "Course",
      accessor: "course",
    },
    {
      Header: "Instructor",
      accessor: "instructor",
    },
    {
      Header: "Grade",
      accessor: "grade",
    },
    {
      Header: "Count",
      accessor: "count",
    },
  ];

  // Grade Data with yyyyq parsed into sessions
  const parsedGradeData = gradeData.map((gradeDist) => ({
    ...gradeDist,
    session: fromFormat(gradeDist.yyyyq),
  }));

  return (
    <OurTable
      data={parsedGradeData}
      columns={columns}
      testid="CourseGradeDistTable"
    />
  );
}
