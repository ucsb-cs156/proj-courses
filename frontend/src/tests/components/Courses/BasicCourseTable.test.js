import { render, screen } from "@testing-library/react";
import { coursesFixtures } from "fixtures/courseFixtures";
import BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("CourseTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseTable courses={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected column headers and content", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseTable courses={coursesFixtures.twoCourses} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "Quarter",
      "Course Id",
      "Title",
      "Description",
      "Level Code",
      "Subject Area",
      "Units",
    ];
    const expectedFields = [
      "quarter",
      "courseId",
      "title",
      "description",
      "objLevelCode",
      "subjectArea",
      "unitsFixed",
    ];
    const testId = "BasicCourseTable";

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
    ).toHaveTextContent("W21");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-courseId`),
    ).toHaveTextContent("CMPSC 16");
  });
});
