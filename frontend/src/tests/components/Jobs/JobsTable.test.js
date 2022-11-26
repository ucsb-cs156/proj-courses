import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import JobsTable from "main/components/Jobs/JobsTable";
import jobsFixtures from "fixtures/jobsFixtures";

describe("JobsTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={[]}  />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });


  test("Has the expected column headers and content", () => {

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={jobsFixtures.sixJobs}  />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ['id', 'Created', 'Updated', 'Status', 'Log'];
    const expectedFields = ['id', 'Created', 'Updated','status', 'Log'];
    const testId = "JobsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-Created`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-Updated`)).toHaveTextContent("11/13/2022, 19:49:59");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-status`)).toHaveTextContent("complete");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-Log`)).toHaveTextContent("Hello World! from test job!Goodbye from test job!");

    expect(screen.getByTestId(`JobsTable-header-id-sort-carets`)).toHaveTextContent("🔽");


  });

});

