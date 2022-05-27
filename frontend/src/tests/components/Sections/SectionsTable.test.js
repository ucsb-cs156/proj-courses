import {  render } from "@testing-library/react";
import { threeSections } from "fixtures/sectionFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
// import { currentUserFixtures } from "fixtures/currentUserFixtures";
import SectionsTable from "main/components/Sections/SectionsTable";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("Section tests", () => {
  const queryClient = new QueryClient();


  test("renders without crashing for empty table", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={[]} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });



  test("Has the expected column headers and content", () => {

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={threeSections} />
        </MemoryRouter>
      </QueryClientProvider>

    );


    const expectedHeaders = ["Quarter",  "Course ID", "Enroll Code","Title","Enrolled","Location", "Days", "Time", "Instructor"];
    const expectedFields = ["quarter", "courseId","enrollCode", "title","enrolled","location", "days", "time", "instructor"];
    const testId = "SectionsTable";

    expectedHeaders.forEach((headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-quarter`)).toHaveTextContent("W22");
    expect(getByTestId(`${testId}-cell-row-0-col-time`)).toHaveTextContent("3:00 PM - 3:50 PM");
    expect(getByTestId(`${testId}-cell-row-1-col-enrolled`)).toHaveTextContent("18/35");
    expect(getByTestId(`${testId}-cell-row-2-col-location`)).toHaveTextContent("1610 BRDA");


  });


});

