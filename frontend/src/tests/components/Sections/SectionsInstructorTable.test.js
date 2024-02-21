import { render, screen } from "@testing-library/react";
import { fiveSections, sixSections } from "fixtures/sectionOverTimeFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SectionsInstructorTable from "main/components/Sections/SectionsInstructorTable";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("Section tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsInstructorTable sections={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected cell values", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsInstructorTable sections={sixSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "Quarter",
      "Course ID",
      "Title",
      "Status",
      "Enrolled",
      "Location",
      "Days",
      "Time",
      "Instructor",
      "Enroll Code",
    ];
    const expectedFields = [
      "quarter",
      "courseInfo.courseId",
      "courseInfo.title",
      "status",
      "enrolled",
      "location",
      "days",
      "time",
      "instructor",
      "section.enrollCode",
    ];
    const testId = "SectionsInstructorTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
    ).toHaveTextContent("S22");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-time`),
    ).toHaveTextContent("9:30 AM - 10:45 AM");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-days`),
    ).toHaveTextContent("T R");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-status`),
    ).toHaveTextContent("Closed");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-enrolled`),
    ).toHaveTextContent("51/77");
    expect(
      screen.getByTestId(`${testId}-cell-row-5-col-location`),
    ).toHaveTextContent("PHELP 1448");
    expect(
      screen.getByTestId(`${testId}-cell-row-5-col-instructor`),
    ).toHaveTextContent("DANESHAMOOZ J, KILGORE J D, YANG YIFAN");
    expect(
      screen.getByTestId(`${testId}-cell-row-5-col-courseInfo.courseId`),
    ).not.toHaveTextContent("CMPSC 130A -1");
  });

  test("Has the expected column headers and content", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsInstructorTable sections={sixSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "Quarter",
      "Course ID",
      "Title",
      "Status",
      "Enrolled",
      "Location",
      "Days",
      "Time",
      "Instructor",
      "Enroll Code",
    ];
    const expectedFields = [
      "quarter",
      "courseInfo.courseId",
      "courseInfo.title",
      "status",
      "enrolled",
      "location",
      "days",
      "time",
      "instructor",
      "section.enrollCode",
    ];
    const testId = "SectionsInstructorTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-courseInfo.courseId`),
    ).toHaveTextContent("CMPSC 130A");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-courseInfo.courseId`),
    ).not.toHaveTextContent("CMPSC 130A -1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-courseInfo.title`),
    ).toHaveTextContent("DATA STRUCT ALGOR");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
    ).toHaveTextContent("S22");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-time`),
    ).toHaveTextContent("9:30 AM - 10:45 AM");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-days`),
    ).toHaveTextContent("T R");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-status`),
    ).toHaveTextContent("Closed");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-enrolled`),
    ).toHaveTextContent("51/77");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-location`),
    ).toHaveTextContent("PSYCH 1902");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
    ).toHaveTextContent("LOKSHTANOV D");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-section.enrollCode`),
    ).toHaveTextContent("08078");
  });

  test("First dropdown is different than last dropdown", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsInstructorTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsInstructorTable";

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-enrolled`),
    ).toHaveTextContent("84/80");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-enrolled`),
    ).toHaveTextContent("21/21");
  });

  test("Status utility identifies each type of status", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsInstructorTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsInstructorTable";

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-status`),
    ).toHaveTextContent("Closed");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-status`),
    ).toHaveTextContent("Full");
    expect(
      screen.getByTestId(`${testId}-cell-row-3-col-status`),
    ).toHaveTextContent("Cancelled");
    expect(
      screen.getByTestId(`${testId}-cell-row-4-col-status`),
    ).toHaveTextContent("Open");
  });
});
