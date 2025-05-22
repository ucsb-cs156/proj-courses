/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // ← added
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
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-${field}`),
      ).toBeInTheDocument();
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

  test("renders long logs and handles truncation (snapshot)", () => {
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

    const logCell = screen.getByTestId("JobsTable-cell-row-0-col-Log");
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

    expect(
      screen.getByTestId("JobsTable-cell-row-0-col-Log"),
    ).toHaveTextContent("No logs available");
    expect(
      screen.getByTestId("JobsTable-cell-row-1-col-Log"),
    ).toHaveTextContent("No logs available");
  });

  // ↓↓↓ NEW TESTS ↓↓↓

  test("JobsTable shows spinner when loading=true", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={[]} loading={true} onSortChange={() => {}} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    // look for the bootstrap spinner class
    expect(document.querySelector(".spinner-border")).toBeInTheDocument();
  });

  test("JobsTable shows 'no jobs to display.' when jobs empty", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable jobs={[]} loading={false} onSortChange={() => {}} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    // case‐insensitive match
    expect(screen.getByText(/no jobs to display\./i)).toBeInTheDocument();
  });

  test("clicking each column header calls onSortChange with the correct field", () => {
    const sortSpy = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsTable
            jobs={jobsFixtures.sixJobs}
            loading={false}
            sortBy={{ id: "id", desc: false }}
            onSortChange={sortSpy}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // The table renders each <th> with role="columnheader"
    const mapping = {
      id: "id",
      Created: "createdAt",
      Updated: "updatedAt",
      Status: "status",
    };

    for (let [label, field] of Object.entries(mapping)) {
      userEvent.click(
        screen.getByRole("columnheader", { name: new RegExp(label, "i") }),
      );
      expect(sortSpy).toHaveBeenLastCalledWith(field);
    }
  });
});
