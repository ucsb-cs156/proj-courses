import { render, screen } from "@testing-library/react";
import SectionsTableBase from "main/components/SectionsTableBase";
import {
  oneLectureSectionWithNoDiscussion,
  gigaSections,
  fiveSections,
} from "fixtures/sectionFixtures";
import primaryFixtures from "fixtures/primaryFixtures";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
import {
  convertToFraction,
  formatDays,
  formatInstructors,
  formatLocation,
  formatTime,
  isSection,
} from "main/utils/sectionUtils.js";
import sectionsTableBaseFixtures from "fixtures/sectionsTableBaseFixtures";

describe("SectionsTableBase tests", () => {
  function getFirstVal(values) {
    return values[0];
  }
  const testid = "testid";
  const columns = sectionsTableBaseFixtures.getExampleColumns(testid);
  const columnsWithInfoAndAddToSchedule = sectionsTableBaseFixtures.getExampleColumnsWithInfoAndAddToSchedule(testid);

  test("renders an empty table without crashing", () => {
    render(<SectionsTableBase columns={columns} data={[]}  />);
  });

  test("renders an full table without crashing", () => {
    render(
      <SectionsTableBase columns={columns} data={primaryFixtures.f24_math_lowerDiv}  />,
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
      <SectionsTableBase columns={columns} data={primaryFixtures.f24_math_lowerDiv}  />,
    );

    // Check the background color of the first few rows
    const rows = [
      screen
        .getByTestId("testid-cell-row-0-col-courseId")
        .closest("tr"),
      screen
        .getByTestId("testid-cell-row-1-col-courseId")
        .closest("tr"),
      screen
        .getByTestId("testid-cell-row-2-col-courseId")
        .closest("tr"),
      screen
        .getByTestId("testid-cell-row-3-col-courseId")
        .closest("tr"),
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
    render(
      <SectionsTableBase columns={columnsWithInfoAndAddToSchedule} data={primaryFixtures.f24_math_lowerDiv} testid={testid} />,
    );
  });
});
