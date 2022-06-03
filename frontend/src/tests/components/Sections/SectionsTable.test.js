import {  fireEvent, render, screen } from "@testing-library/react";
import { fiveSections, gigaSections } from "fixtures/sectionFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
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



  test("Has the expected cell values when expanded", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>

    );


    const expectedHeaders = ["Quarter",  "Course ID", "Title", "Enrolled", "Location", "Days", "Time", "Instructor", "Enroll Code"];
    const expectedFields = ["quarter", "courseInfo.courseId", "courseInfo.title", "enrolled", "location", "days", "time", "instructor", "section.enrollCode"];
    const testId = "SectionsTable";
    

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    const expandRow = screen.getByTestId(`${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`)
    fireEvent.click(expandRow);

    expect(screen.getByTestId(`${testId}-cell-row-0-col-quarter`)).toHaveTextContent("W22");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-time`)).toHaveTextContent("3:00 PM - 3:50 PM");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-days`)).toHaveTextContent("M");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-enrolled`)).toHaveTextContent("84/100");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-location`)).toHaveTextContent("HFH 1124");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-instructor`)).toHaveTextContent("YUNG A S");



  });

  test("Has the expected column headers and content", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>
      );

      const expectedHeaders = ["Quarter",  "Course ID", "Title", "Enrolled", "Location", "Days", "Time", "Instructor", "Enroll Code"];
      const expectedFields = ["quarter", "courseInfo.courseId", "courseInfo.title", "enrolled", "location", "days", "time", "instructor", "section.enrollCode"];
      const testId = "SectionsTable";

      expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });


      expectedFields.forEach((field) => {
        const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
      });
      expect(screen.getByTestId(`${testId}-cell-row-0-col-courseInfo.courseId`)).toHaveTextContent("ECE 1A");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-courseInfo.title`)).toHaveTextContent("COMP ENGR SEMINAR");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-quarter`)).toHaveTextContent("W22");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-time`)).toHaveTextContent("3:00 PM - 3:50 PM");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-days`)).toHaveTextContent("M");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-enrolled`)).toHaveTextContent("84/100");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-location`)).toHaveTextContent("BUCHN 1930");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-instructor`)).toHaveTextContent("WANG L C");
      expect(screen.getByTestId(`${testId}-cell-row-0-col-section.enrollCode`)).toHaveTextContent("12583");
      

  });

  test("Correctly groups separate lectures of the same class", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={gigaSections} />
        </MemoryRouter>
      </QueryClientProvider>
      );
    
      const testId = "SectionsTable"

      expect(screen.getByTestId(`${testId}-cell-row-1-col-courseInfo.courseId`)).toHaveTextContent("➕ MATH 3B");
      expect(screen.getByTestId(`${testId}-cell-row-2-col-courseInfo.courseId`)).toHaveTextContent("➕ MATH 3B");

      const expandRow = screen.getByTestId(`${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`)
      fireEvent.click(expandRow);


      expect(screen.getByTestId(`${testId}-cell-row-1-col-courseInfo.courseId`)).toHaveTextContent("➖ MATH 3B");
  })

  test("First dropdown is different than last dropdown", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>
      );

      const testId = "SectionsTable"

      const expandRow = screen.getByTestId(`${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`)
      fireEvent.click(expandRow);

      expect(screen.getByTestId(`${testId}-cell-row-1-col-enrolled`)).toHaveTextContent("84/80");
      expect(screen.getByTestId(`${testId}-cell-row-2-col-enrolled`)).toHaveTextContent("21/21");
  });


});

