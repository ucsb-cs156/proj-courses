import { vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SectionsTableBase from "main/components/SectionsTableBase";
import primaryFixtures from "fixtures/primaryFixtures";
import sectionsTableBaseFixtures from "fixtures/sectionsTableBaseFixtures";
import { useReactTable } from "@tanstack/react-table";

// Mock react-table to allow spying/mocking, but pass through by default
vi.mock("@tanstack/react-table", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useReactTable: vi.fn((opts) => actual.useReactTable(opts)),
  };
});

describe("SectionsTableBase tests", () => {
  // Ensure clean state between tests
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("SectionsTableBase regular tests", () => {
    const testid = "testid";
    const columns = sectionsTableBaseFixtures.getExampleColumns(testid);

    test("renders an empty table without crashing", () => {
      render(<SectionsTableBase columns={columns} data={[]} />);
    });

    test("renders an full table correctly", () => {
      render(
        <SectionsTableBase
          columns={columns}
          data={primaryFixtures.f24_math_lowerDiv}
        />,
      );
      expect(screen.getByTestId("testid-row-0")).toBeInTheDocument();
      const cellInFirstRow = screen.getByTestId(
        "testid-cell-row-0-col-courseId",
      );
      expect(cellInFirstRow).toBeInTheDocument();
      expect(cellInFirstRow.textContent).toBe("MATH      2A ");
      expect(cellInFirstRow).toHaveAttribute(
        "style",
        "background-color: inherit; font-weight: bold;",
      );

      const openAllRowsButton = screen.getByTestId(`${testid}-expand-all-rows`);
      expect(openAllRowsButton).toBeInTheDocument();
      expect(openAllRowsButton.textContent).toBe("➕");
      fireEvent.click(openAllRowsButton);
      expect(openAllRowsButton.textContent).toBe("➖");

      const cellInFirstSubRow = screen.getByTestId(
        "testid-cell-row-0.1-col-courseId",
      );
      expect(cellInFirstSubRow).toBeInTheDocument();
      expect(cellInFirstSubRow.textContent).toBe("");
      expect(cellInFirstSubRow).toHaveAttribute(
        "style",
        "background-color: inherit; font-weight: normal;",
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

      const rows = [
        screen.getByTestId("testid-cell-row-0-col-courseId").closest("tr"),
        screen.getByTestId("testid-cell-row-1-col-courseId").closest("tr"),
        screen.getByTestId("testid-cell-row-2-col-courseId").closest("tr"),
        screen.getByTestId("testid-cell-row-3-col-courseId").closest("tr"),
      ];

      const expectedBackgroundColors = [
        "rgb(227, 235, 252)",
        "rgb(255, 255, 255)",
        "rgb(227, 235, 252)",
        "rgb(255, 255, 255)",
      ];

      rows.forEach((row, index) => {
        const style = window.getComputedStyle(row);
        expect(style.backgroundColor).toBe(expectedBackgroundColors[index]);
      });
    });
  });

  describe("SectionsTableBase tests for corner cases", () => {
    test("renders header with placeholder (null) when header.isPlaceholder is true", async () => {
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

      const data = [{ placeholderCol: "foo", realCol: "bar" }];

      // Import the actual useReactTable before mocking
      const actual = await vi.importActual("@tanstack/react-table");

      useReactTable.mockImplementation((opts) => {
        const realTable = actual.useReactTable(opts);
        return {
          ...realTable,
          getHeaderGroups: () => [
            {
              id: "headerGroup1",
              headers: [
                { id: "placeholderCol", colSpan: 1, isPlaceholder: true },
                {
                  id: "realCol",
                  colSpan: 1,
                  isPlaceholder: false,
                  column: { columnDef: { header: "Real Header" } },
                  getContext: () => ({}),
                },
              ],
            },
          ],
          getFooterGroups: () => [
            {
              id: "footerGroup1",
              headers: [
                { id: "placeholderCol", colSpan: 1, isPlaceholder: true },
                {
                  id: "realCol",
                  colSpan: 1,
                  isPlaceholder: false,
                  column: { columnDef: { footer: "Real Footer" } },
                  getContext: () => ({}),
                },
              ],
            },
          ],
        };
      });

      render(
        <SectionsTableBase
          columns={columnsWithPlaceholder}
          data={data}
          testid="testid"
        />,
      );

      expect(screen.queryByText("Should not render")).not.toBeInTheDocument();
      expect(screen.getByText("Real Header")).toBeInTheDocument();
      expect(screen.queryByText("Should not render")).not.toBeInTheDocument();
      expect(screen.getByText("Real Footer")).toBeInTheDocument();
    });
  });

  describe("SectionsTableBase pagination tests", () => {
    const testid = "testid";
    const columns = sectionsTableBaseFixtures.getExampleColumns(testid);

    test("does NOT render pagination when list is short (<= 10)", async () => {
      render(
        <SectionsTableBase
          columns={columns}
          data={primaryFixtures.f24_math_lowerDiv.slice(0, 3)}
        />,
      );
      const pagination = screen.queryByTestId("OurPagination-next");
      expect(pagination).not.toBeInTheDocument();
    });

    test("renders pagination and handles navigation for long lists (> 10)", async () => {
      const twentyFiveItems = [];
      for (let i = 0; i < 25; i++) {
        const item = { ...primaryFixtures.f24_math_lowerDiv[0] };
        item.courseId = `MATH-TEST-${i}`;
        item.enrollCode = `000${i}`;
        twentyFiveItems.push(item);
      }

      render(<SectionsTableBase columns={columns} data={twentyFiveItems} />);

      expect(screen.getByText("MATH-TEST-0")).toBeInTheDocument();
      expect(screen.getByText("MATH-TEST-9")).toBeInTheDocument();
      expect(screen.queryByText("MATH-TEST-10")).not.toBeInTheDocument();

      const nextBtn = screen.getByTestId("OurPagination-next");
      expect(nextBtn).toBeInTheDocument();

      fireEvent.click(nextBtn);

      expect(screen.queryByText("MATH-TEST-0")).not.toBeInTheDocument();
      expect(screen.getByText("MATH-TEST-10")).toBeInTheDocument();
      expect(screen.getByText("MATH-TEST-19")).toBeInTheDocument();

      fireEvent.click(nextBtn);

      expect(screen.getByText("MATH-TEST-24")).toBeInTheDocument();
      expect(screen.queryByText("MATH-TEST-19")).not.toBeInTheDocument();
    });
  });
});
