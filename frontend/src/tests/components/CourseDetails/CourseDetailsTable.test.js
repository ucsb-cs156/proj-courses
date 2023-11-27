import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import CourseDetailsTable from "main/components/CourseDetails/CourseDetailsTable";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const mockedMutate = jest.fn();

jest.mock("main/utils/useBackend", () => ({
  ...jest.requireActual("main/utils/useBackend"),
  useBackendMutation: () => ({ mutate: mockedMutate }),
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();
  test("renders without crashing for empty table", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDetailsTable details={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected colum headers and content", () => {
    // console.log(oneSection)
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDetailsTable
            details={personalSectionsFixtures.threePersonalSections}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = ["Course ID", "Enroll Code", "Section", "Title", "Enrolled", "Location", "Days", "Time", "Instructor"];
    const expectedFields = ["courseId", "classSections[0].enrollCode", "classSections[0].section", "title", "enrolled", "location"];
    const testId = "CourseDetailsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-courseId`)).toHaveTextContent(
      "ECE 1A",
    );
    expect(screen.getByTestId(`${testId}-cell-row-0-col-classSections[0].enrollCode`)).toHaveTextContent(
      "12583",
    );
    expect(screen.getByTestId(`${testId}-cell-row-0-col-classSections[0].section`)).toHaveTextContent(
      "0100",
    ); 
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent(
        "COMP ENGR SEMINAR",
    ); 
    expect(screen.getByTestId(`${testId}-cell-row-0-col-location`)).toHaveTextContent(
        "BUCHN 1930",
    ); 
    expect(screen.getByTestId(`${testId}-cell-row-0-col-instructor`)).toHaveTextContent(
        "WANG L C",
    ); 
  });
});
