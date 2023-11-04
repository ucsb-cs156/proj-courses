import { render } from "@testing-library/react";
import SectionsOverTimeTableBase from "main/components/SectionsOverTimeTableBase";

describe("SectionsOverTimeTableBase tests", () => {
  const columns = [
    {
      Header: "Column 1",
      accessor: "col1", // accessor is the "key" in the data
    },
    {
      Header: "Column 2",
      accessor: "col2",
    },
    //add groupable columns
    {
      Header: "Groupable",
      accessor: "quarter",
    },
  ];

  test("renders an empty table without crashing", () => {
    render(
      <SectionsOverTimeTableBase columns={columns} data={[]} group={false} />,
    );
  });
});
