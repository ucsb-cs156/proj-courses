import { render, screen } from "@testing-library/react";
import SectionsTableBase from "main/components/SectionsTableBase";
import {
  oneLectureSectionWithNoDiscussion,
  gigaSections,
  fiveSections,
} from "fixtures/sectionFixtures";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
import {
  convertToFraction,
  formatDays,
  formatInstructors,
  formatLocation,
  formatTime,
  isSection,
} from "main/utils/sectionUtils.js";

describe("SectionsTableBase tests", () => {
  function getFirstVal(values) {
    return values[0];
  }

  const columns = [
    {
      Header: "Quarter",
      accessor: (row) => yyyyqToQyy(row.courseInfo.quarter),
      disableGroupBy: true,
      id: "quarter",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Course ID",
      accessor: "courseInfo.courseId",

      Cell: ({ cell: { value } }) => value.substring(0, value.length - 2),
    },
    {
      Header: "Title",
      accessor: "courseInfo.title",
      disableGroupBy: true,

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
      Header: "Is Section?",
      accessor: (row) => isSection(row.section.section),
      // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
      id: "isSection",
    },
    {
      Header: "Enrolled",
      accessor: (row) =>
        convertToFraction(row.section.enrolledTotal, row.section.maxEnroll),
      disableGroupBy: true,
      id: "enrolled",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Location",
      accessor: (row) => formatLocation(row.section.timeLocations),
      disableGroupBy: true,
      id: "location",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Days",
      accessor: (row) => formatDays(row.section.timeLocations),
      disableGroupBy: true,
      id: "days",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Time",
      accessor: (row) => formatTime(row.section.timeLocations),
      disableGroupBy: true,
      id: "time",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Instructor",
      accessor: (row) => formatInstructors(row.section.instructors),
      disableGroupBy: true,
      id: "instructor",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Enroll Code",
      accessor: "section.enrollCode",
      disableGroupBy: true,

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
  ];

  test("renders an empty table without crashing", () => {
    render(<SectionsTableBase columns={columns} data={[]} group={false} />);
  });

  test("renders an full table without crashing", () => {
    render(
      <SectionsTableBase columns={columns} data={gigaSections} group={false} />,
    );
  });

  test("renders a single lecture section correctly", async () => {
    render(
      <SectionsTableBase
        columns={columns}
        data={oneLectureSectionWithNoDiscussion}
        group={false}
      />,
    );

    expect(screen.queryByText("➖")).not.toBeInTheDocument();
    expect(screen.queryByText("➕")).not.toBeInTheDocument();
  });

  test("renders five sections (one with no discussion then lecture with three discussions) correctly", async () => {
    render(
      <SectionsTableBase columns={columns} data={fiveSections} group={false} />,
    );

    expect(screen.getByText("➕")).toBeInTheDocument();
    expect(screen.queryByText("➖")).not.toBeInTheDocument();
    expect(
      screen.getByTestId(
        "testid-cell-row-1-col-courseInfo.courseId-expand-symbols",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("testid-cell-row-0-col-courseInfo.courseId"),
    ).toHaveAttribute("style", "color: rgb(74, 79, 79); font-weight: bold;");
  });

  test("renders rows with alternating background colors correctly", async () => {
    render(
      <SectionsTableBase columns={columns} data={fiveSections} group={false} />,
    );

    // Check the background color of the first few rows
    const rows = [
      screen
        .getByTestId("testid-cell-row-0-col-courseInfo.courseId")
        .closest("tr"),
      screen
        .getByTestId("testid-cell-row-1-col-courseInfo.courseId")
        .closest("tr"),
      screen
        .getByTestId("testid-cell-row-2-col-courseInfo.courseId")
        .closest("tr"),
      screen
        .getByTestId("testid-cell-row-3-col-courseInfo.courseId")
        .closest("tr"),
      screen
        .getByTestId("testid-cell-row-4-col-courseInfo.courseId")
        .closest("tr"),
    ];

    // Expected background colors
    const expectedBackgroundColors = [
      "rgb(227, 235, 252)", // #e3ebfc in RGB format
      "rgb(255, 255, 255)", // #ffffff in RGB format
      "rgb(227, 235, 252)", // #e3ebfc in RGB format
      "rgb(255, 255, 255)", // #ffffff in RGB format
      "rgb(227, 235, 252)", // #e3ebfc in RGB format
    ];

    // Verify the background colors for each row
    rows.forEach((row, index) => {
      const style = window.getComputedStyle(row);
      expect(style.backgroundColor).toBe(expectedBackgroundColors[index]);
    });
  });
});
