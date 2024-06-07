import OurTable from "../OurTable";
import { fromFormat } from "main/utils/quarterUtilities";

export default function GradeHistoryTable({ grades }) {
  const columns = [
    {
      Header: "Quarter",
      accessor: (row) => fromFormat(row.yyyyq),
      id: "quarter",
    },
    {
      Header: "Course ID",
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

  return (
    <OurTable data={grades} columns={columns} testid="GradeHistoryTable" />
  );
}
