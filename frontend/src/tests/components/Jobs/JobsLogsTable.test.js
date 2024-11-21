import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import JobsLogTable from "main/components/Jobs/JobsLogTable";
import jobsFixtures from "fixtures/jobsFixtures";

describe("JobsLogTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsLogTable />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected column headers and content", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsLogTable job={jobsFixtures.oneCompleteJob} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = ["ID", "Created", "Updated", "Status", "Field", "Value", "#", "Log Line"];
    const testId = "JobsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId("JobLogTable-cell-row-0-col-field")).toHaveTextContent(
      "ID",
    );
    expect(screen.getByTestId("JobLogTable-cell-row-0-col-value")).toHaveTextContent(
      "1",
    );
    expect(screen.getByTestId("JobLogTable-cell-row-1-col-field")).toHaveTextContent(
      "Created",
    );
    expect(screen.getByTestId("JobLogTable-cell-row-1-col-value")).toHaveTextContent(
      "11/13/2022, 7:49:58 PM",
    );
    expect(screen.getByTestId("JobLogTable-cell-row-2-col-field")).toHaveTextContent(
      "Updated",
    );
    expect(screen.getByTestId("JobLogTable-cell-row-2-col-value")).toHaveTextContent(
      "11/13/2022, 7:49:59 PM",
    );
    expect(screen.getByTestId("JobLogTable-cell-row-3-col-field")).toHaveTextContent(
      "Status",
    );
    expect(screen.getByTestId("JobLogTable-cell-row-3-col-value")).toHaveTextContent(
      "complete",
    );

    expect(
      screen.getByTestId("JobLogTable-cell-row-0-col-index"),
    ).toHaveTextContent("1");

    expect(
      screen.getByTestId("JobLogTable-cell-row-0-col-logLine"),
    ).toHaveTextContent("Hello World! from test job");

    expect(
        screen.getByTestId("JobLogTable-cell-row-1-col-index"),
      ).toHaveTextContent("2");
  
      expect(
        screen.getByTestId("JobLogTable-cell-row-1-col-logLine"),
      ).toHaveTextContent("Goodbye from test job!");

  });
});
