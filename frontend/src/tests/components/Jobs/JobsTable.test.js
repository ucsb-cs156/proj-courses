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
    ).toHaveTextContent("Hello World! from test job! Goodbye from test job!");

    expect(
      screen.getByTestId(`JobsTable-header-id-sort-carets`),
    ).toHaveTextContent("🔽");
  });

  test("renders short logs correctly", () => {
    const jobsWithShortLog = [
      {
        id: 1,
        createdAt: "2023-11-01T12:00:00Z",
        updatedAt: "2023-11-01T12:30:00Z",
        status: "pending",
        log: "Single line log",
      },
    ];

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={jobsWithShortLog} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const logCell = screen.getByTestId("JobsTable-cell-row-0-col-Log");
    expect(logCell).toHaveTextContent("Single line log");
  });

  test("renders long logs and handles truncation", () => {
    const jobsWithLongLog = [
      {
        id: 2,
        createdAt: "2023-11-01T12:00:00Z",
        updatedAt: "2023-11-01T12:30:00Z",
        status: "in-progress",
        log: "Line \n".repeat(15), // Long log of 15 lines
      },
    ];

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={jobsWithLongLog} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const logCell = screen.getByTestId("JobsTable-cell-row-0-col-Log");
    const logText = "Line Line Line Line Line Line Line Line Line Line"; // 15 lines
    expect(logCell).toHaveTextContent(logText.slice(0, 10)); // The first 10 lines

    // Check that the "See entire log" link is present
    const link = screen.getByRole("link", { name: /See entire log/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/admin/jobs/logs/2");
  });

  test("does not show 'See entire log' for logs of exactly 10 lines", () => {
    const jobsWithExact10Lines = [
      {
        id: 2,
        createdAt: "2023-11-01T12:00:00Z",
        updatedAt: "2023-11-01T12:30:00Z",
        status: "in-progress",
        log: "Line \n".repeat(9), // Exactly 10 lines
      },
    ];

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={jobsWithExact10Lines} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const logCell = screen.getByTestId("JobsTable-cell-row-0-col-Log");
    expect(logCell).toHaveTextContent(
      "Line Line Line Line Line Line Line Line Line",
    );

    // The 'See entire log' link should NOT be present because the log is exactly 10 lines
    const link = screen.queryByRole("link", { name: /See entire log/i });
    expect(link).not.toBeInTheDocument();
  });

  test("displays 'No logs available' when log is empty or null", () => {
    const jobsWithEmptyLog = [
      {
        id: 3,
        createdAt: "2023-11-01T12:00:00Z",
        updatedAt: "2023-11-01T12:30:00Z",
        status: "complete",
        log: null,
      },
      {
        id: 4,
        createdAt: "2023-11-01T12:00:00Z",
        updatedAt: "2023-11-01T12:30:00Z",
        status: "complete",
        log: "",
      },
    ];

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={jobsWithEmptyLog} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const logCell1 = screen.getByTestId("JobsTable-cell-row-0-col-Log");
    const logCell2 = screen.getByTestId("JobsTable-cell-row-1-col-Log");

    expect(logCell1).toHaveTextContent("No logs available");
    expect(logCell2).toHaveTextContent("No logs available");
  });
});
