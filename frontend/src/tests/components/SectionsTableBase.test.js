import { render, screen } from "@testing-library/react";
import SectionsTableBase from "main/components/SectionsTableBase";
import primaryFixtures from "fixtures/primaryFixtures";
import sectionsTableBaseFixtures from "fixtures/sectionsTableBaseFixtures";
import { QueryClient, QueryClientProvider } from "react-query";

describe("SectionsTableBase tests", () => {
  describe("SectionsTableBase regular tests", () => {


    const testid = "testid";
    const columns = sectionsTableBaseFixtures.getExampleColumns(testid);
    const columnsWithInfoAndAddToSchedule =
      sectionsTableBaseFixtures.getExampleColumnsWithInfoAndAddToSchedule(testid);

    test("renders an empty table without crashing", () => {
      render(<SectionsTableBase columns={columns} data={[]} />);
    });

    test("renders an full table without crashing", () => {
      render(
        <SectionsTableBase
          columns={columns}
          data={primaryFixtures.f24_math_lowerDiv}
        />,
      );
    });

    test("renders a single lecture section correctly", async () => {
      render(
        <SectionsTableBase
          columns={columns}
          data={primaryFixtures.singleLectureSectionWithNoDiscussion}
        />,
      );

      expect(screen.getAllByText("➕")).toHaveLength(1);
    });

    test("renders rows with alternating background colors correctly", async () => {
      render(
        <SectionsTableBase
          columns={columns}
          data={primaryFixtures.f24_math_lowerDiv}
        />,
      );

      // Check the background color of the first few rows
      const rows = [
        screen.getByTestId("testid-cell-row-0-col-courseId").closest("tr"),
        screen.getByTestId("testid-cell-row-1-col-courseId").closest("tr"),
        screen.getByTestId("testid-cell-row-2-col-courseId").closest("tr"),
        screen.getByTestId("testid-cell-row-3-col-courseId").closest("tr"),
      ];

      // Expected background colors
      const expectedBackgroundColors = [
        "rgb(227, 235, 252)", // #e3ebfc in RGB format
        "rgb(255, 255, 255)", // #ffffff in RGB format
        "rgb(227, 235, 252)", // #e3ebfc in RGB format
        "rgb(255, 255, 255)", // #ffffff in RGB format
      ];

      // Verify the background colors for each row
      rows.forEach((row, index) => {
        const style = window.getComputedStyle(row);
        expect(style.backgroundColor).toBe(expectedBackgroundColors[index]);
      });
    });
    test("renders a table with info column and add  buttons", () => {
      const queryClient = new QueryClient();
      render(
        <QueryClientProvider client={queryClient}>
          <SectionsTableBase
            columns={columnsWithInfoAndAddToSchedule}
            data={primaryFixtures.f24_math_lowerDiv}
            testid={testid}
          />
        </QueryClientProvider>,
      );
      expect(screen.getByTestId(`${testid}-expand-all-rows`)).toBeInTheDocument();
    });

  });
  describe("SectionsTableBase tests for corner cases", () => {
    test("renders header with placeholder (null) when header.isPlaceholder is true", () => {
      // Create a columns array with a placeholder header
      const columnsWithPlaceholder = [
        {
          id: "placeholderCol",
          header: "Should not render",
          accessorKey: "placeholderCol",
        },
        {
          id: "realCol",
          header: "Real Header",
          accessorKey: "realCol",
        },
      ];

      // Mock data
      const data = [
        { placeholderCol: "foo", realCol: "bar" },
      ];

      // Import the actual useReactTable before mocking
      const actualReactTable = require("@tanstack/react-table");
      const actualUseReactTable = actualReactTable.useReactTable;

      jest.spyOn(actualReactTable, "useReactTable").mockImplementation((opts) => {
        // Call the real hook to get the table object
        const realTable = actualUseReactTable(opts);
        // Override getHeaderGroups and getFooterGroups to simulate a placeholder header/footer
        return {
          ...realTable,
          getHeaderGroups: () => [
            {
              id: "headerGroup1",
              headers: [
                { id: "placeholderCol", colSpan: 1, isPlaceholder: true },
                { id: "realCol", colSpan: 1, isPlaceholder: false, column: { columnDef: { header: "Real Header" } }, getContext: () => ({}) },
              ],
            },
          ],
          getFooterGroups: () => [
            {
              id: "footerGroup1",
              headers: [
                { id: "placeholderCol", colSpan: 1, isPlaceholder: true },
                { id: "realCol", colSpan: 1, isPlaceholder: false, column: { columnDef: { footer: "Real Footer" } }, getContext: () => ({}) },
              ],
            },
          ],
        };
      });

      render(<SectionsTableBase columns={columnsWithPlaceholder} data={data} testid="testid" />);

      // The placeholder header should not be rendered
      expect(screen.queryByText("Should not render")).not.toBeInTheDocument();
      // The real header should be rendered
      expect(screen.getByText("Real Header")).toBeInTheDocument();

      // The placeholder footer should not be rendered
      expect(screen.queryByText("Should not render")).not.toBeInTheDocument();
      // The real footer should be rendered
      expect(screen.getByText("Real Footer")).toBeInTheDocument();

      // Restore the original implementation
      jest.resetAllMocks();
    });
  });

});
