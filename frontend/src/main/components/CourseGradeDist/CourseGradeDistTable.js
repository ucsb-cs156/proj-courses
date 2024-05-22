import OurTable from "../OurTable";

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

  for (const gradeDist of gradeData) {
    const year = gradeDist.yyyyq.slice(0, 4);
    let quarter;
    switch (gradeDist.yyyyq[4]) {
      case "1":
        quarter = "Winter";
        break;
      case "2":
        quarter = "Spring";
        break;
      case "3":
        quarter = "Summer";
        break;
      default:
        // There should never be a case where its not 1,2,3,4, right..
        quarter = "Fall";
    }
    const session = quarter + " " + year;
    gradeDist.session = session;
  }

  return (
    <OurTable
      data={gradeData}
      columns={columns}
      testid="CourseGradeDistTable"
    />
  );
}
