import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import JobsTable from "main/components/Jobs/JobsTable";
import jobsFixtures from "fixtures/jobsFixtures";

describe("JobsTable tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty table", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected column headers and content", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={jobsFixtures.sixJobs} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = ["id", "Created", "Updated", "Status", "Log"];
    const expectedFields = ["id", "Created", "Updated", "status", "Log"];
    const testId = "JobsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Created`),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Updated`),
    ).toHaveTextContent("11/13/2022, 19:49:59");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-status`),
    ).toHaveTextContent("complete");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Log`),
    ).toHaveTextContent("Hello World! from test job!Goodbye from test job!");

    expect(
      screen.getByTestId(`JobsTable-header-id-sort-carets`),
    ).toHaveTextContent("🔽");
  });
  test("Truncates logs longer than 10 lines", () => {
    const jobsWithLongLog = [
      {
        id: "1",
        createdAt: "2022-11-13T19:49:59",
        updatedAt: "2022-11-13T19:49:59",
        status: "complete",
        log: Array(15).fill("Log").join("\n"), // 15 lines of "Log"
      },
    ];

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={jobsWithLongLog} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "JobsTable";
    const logCell = screen.getByTestId(`${testId}-cell-row-0-col-Log`);

    const expectedLog = Array(10).fill("Log").join(""); // Remove \n to match flattened DOM output
    expect(logCell.textContent).toBe(expectedLog);
  });

  test("Does not truncate logs 10 lines or shorter", () => {
    const jobsWithShortLog = [
      {
        id: "1",
        createdAt: "2022-11-13T19:49:59",
        updatedAt: "2022-11-13T19:49:59",
        status: "complete",
        log: Array(10).fill("Log").join("\n"), // Exactly 10 lines
      },
    ];

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={jobsWithShortLog} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "JobsTable";
    const logCell = screen.getByTestId(`${testId}-cell-row-0-col-Log`);

    const expectedLog = Array(10).fill("Log").join(""); // Remove \n to match flattened DOM output
    expect(logCell.textContent).toBe(expectedLog);
  });

  test("Handles empty logs gracefully", () => {
    const jobsWithEmptyLog = [
      {
        id: "1",
        createdAt: "2022-11-13T19:49:59",
        updatedAt: "2022-11-13T19:49:59",
        status: "complete",
        log: "", // Empty log
      },
    ];

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={jobsWithEmptyLog} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "JobsTable";
    const logCell = screen.getByTestId(`${testId}-cell-row-0-col-Log`);

    // Check that the log cell is empty
    expect(logCell).toHaveTextContent("");
  });
});
