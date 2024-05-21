import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import GradeHistoryTable from "main/components/GradeHistory/GradeHistoryTable";
import { gradeHistoryFixtures } from "fixtures/gradeHistoryFixtures";

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

describe("GradeHistoryTable tests", () => {
    const queryClient = new QueryClient();
    test("renders without crashing for empty table", () => {
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <GradeHistoryTable details={[]} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
      });

      test("Has the expected colum headers and content", () => {
        // console.log(oneSection)
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <GradeHistoryTable
                details={gradeHistoryFixtures.gradeHistoryData}
              />
            </MemoryRouter>
          </QueryClientProvider>,
        );

        const expectedHeaders = [
            "ID",
            "Term",
            "Course",
            "Instructor",
            "Grade",
            "Count",
            "Subject Area",
            "Course Number",
          ];
          const testId = "GradeHistoryTable";

          expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
          });

          expect(
            screen.getByTestId(`${testId}-cell-row-0-col-id`),
          ).toHaveTextContent("889");
          expect(
            screen.getByTestId(`${testId}-cell-row-0-col-yyyyq`),
          ).toHaveTextContent("20094");
          expect(
            screen.getByTestId(`${testId}-cell-row-0-col-course`),
          ).toHaveTextContent("CMPSC 130A");
          expect(
            screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
          ).toHaveTextContent("GONZALEZ T F");
          expect(
            screen.getByTestId(`${testId}-cell-row-0-col-grade`),
          ).toHaveTextContent("A+");
          expect(
            screen.getByTestId(`${testId}-cell-row-0-col-count`),
          ).toHaveTextContent("1");
          expect(
            screen.getByTestId(`${testId}-cell-row-0-col-subjectArea`),
          ).toHaveTextContent("CMPSC");
          expect(
            screen.getByTestId(`${testId}-cell-row-0-col-courseNum`),
          ).toHaveTextContent("130A");
        });
      });