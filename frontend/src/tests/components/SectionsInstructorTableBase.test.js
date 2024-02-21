import { render } from "@testing-library/react";
import SectionsInstructorTableBase from "main/components/SectionsInstructorTableBase";

describe("SectionsInstructorTableBase tests", () => {
  const columns = [
    {
      Header: "Column 1",
      accessor: "col1", // accessor is the "key" in the data
    },
    {
      Header: "Column 2",
      accessor: "col2",
    },
  ];

  test("renders an empty table without crashing", () => {
    render(
      <SectionsInstructorTableBase columns={columns} data={[]} group={false} />,
    );
  });
});
