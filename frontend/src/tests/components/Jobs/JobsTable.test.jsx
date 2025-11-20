import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import JobsTable from "main/components/Jobs/JobsTable";
import jobsFixtures from "fixtures/jobsFixtures";

describe("JobsTable tests", () => {
  const queryClient = new QueryClient();

  test("renders correctly for empty table", () => {
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

    // Check that all jobs are rendered (order determined by server)
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(7); // 6 jobs + 1 header row
    // Jobs appear in the order they're provided by the server (fixture order: 1, 2, 3, 4, 6, 5)
    expect(rows[1]).toHaveTextContent("1");
    expect(rows[2]).toHaveTextContent("2");
    expect(rows[3]).toHaveTextContent("3");
    expect(rows[4]).toHaveTextContent("4");
    expect(rows[5]).toHaveTextContent("6");
    expect(rows[6]).toHaveTextContent("5");
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
    const truncatedLog = jobsWithLongLog[0].log
      .split("\n")
      .slice(0, 10)
      .join("");

    expect(logCell).toHaveTextContent(truncatedLog.replace(/\n/g, ""));

    const link = screen.getByRole("link", { name: /See entire log/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/admin/jobs/logs/2");
  });

  test("renders long logs and handles truncation (snapshot)", async () => {
    const queryClient = new QueryClient();
    const jobsWithLongLog = [
      {
        id: 2,
        createdAt: "2023-11-01T12:00:00Z",
        updatedAt: "2023-11-01T12:30:00Z",
        status: "in-progress",
        log: "Line \n".repeat(15),
      },
    ];

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={jobsWithLongLog} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const logCell = await screen.findByTestId("JobsTable-cell-row-0-col-Log");
    expect(logCell).toMatchSnapshot();
  });

  test("does not show 'See entire log' for logs of exactly 10 lines", () => {
    const jobsWithExact10Lines = [
      {
        id: 2,
        createdAt: "2023-11-01T12:00:00Z",
        updatedAt: "2023-11-01T12:30:00Z",
        status: "in-progress",
        log: "Line \n".repeat(9),
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

    // The 'See entire log' link should NOT be present
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
