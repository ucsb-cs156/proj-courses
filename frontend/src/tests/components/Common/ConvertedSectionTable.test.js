import { render, screen } from "@testing-library/react";
import ConvertedSectionTable from "main/components/Common/ConvertedSectionTable";
import { oneSection } from "fixtures/sectionFixtures";

describe("ConvertedSectionTable tests", () => {
  test("renders with expected headers", () => {
    render(<ConvertedSectionTable sections={[]} />);

    expect(screen.getByTestId("ConvertedSectionTable")).toBeInTheDocument();

    const expectedHeaders = [
      "Quarter",
      "CourseId",
      "Title",
      "EnrollCd",
      "Status",
      "Enrolled",
      "Days",
      "Time",
      "Location",
      "Instructors",
    ];

    expectedHeaders.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  test("renders with expected fields", () => {
    const testid = "AnotherTestId";
    render(<ConvertedSectionTable sections={oneSection} testid={testid} />);

    const quarter = screen.getByTestId(`${testid}-cell-row-0-col-quarter`);
    expect(quarter).toBeInTheDocument();
    expect(quarter).toHaveTextContent("W22");

    const courseId = screen.getByTestId(`${testid}-cell-row-0-col-courseId`);
    expect(courseId).toBeInTheDocument();
    expect(courseId).toHaveTextContent("ECE 1A -1");

    const title = screen.getByTestId(`${testid}-cell-row-0-col-title`);
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("COMP ENGR SEMINAR");

    const enrollCd = screen.getByTestId(`${testid}-cell-row-0-col-enrollCode`);
    expect(enrollCd).toBeInTheDocument();
    expect(enrollCd).toHaveTextContent("12583");

    const status = screen.getByTestId(`${testid}-cell-row-0-col-status`);
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent("Open");

    const enrolled = screen.getByTestId(`${testid}-cell-row-0-col-enrolled`);
    expect(enrolled).toBeInTheDocument();
    expect(enrolled).toHaveTextContent("84/100");

    const days = screen.getByTestId(`${testid}-cell-row-0-col-days`);
    expect(days).toBeInTheDocument();
    expect(days).toHaveTextContent("M");

    const time = screen.getByTestId(`${testid}-cell-row-0-col-time`);
    expect(time).toBeInTheDocument();
    expect(time).toHaveTextContent("3:00 PM - 3:50 PM");

    const location = screen.getByTestId(`${testid}-cell-row-0-col-location`);
    expect(location).toBeInTheDocument();
    expect(location).toHaveTextContent("BUCHN 1930");

    const instructors = screen.getByTestId(
      `${testid}-cell-row-0-col-instructors`,
    );
    expect(instructors).toBeInTheDocument();
    expect(instructors).toHaveTextContent("WANG L C");
  });
});
