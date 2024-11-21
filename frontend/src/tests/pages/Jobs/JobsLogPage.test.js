import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { allTheSubjects } from "fixtures/subjectFixtures";

import JobsLogPage from "main/pages/Jobs/JobsLogPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import jobsFixtures from "fixtures/jobsFixtures";

describe("JobsLogPage tests", () => {
  const queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock.onGet("/api/jobs/all").reply(200, jobsFixtures.sixJobs);
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
  });

  const mockJob = {
    id: "123",
    createdAt: "2022-11-13T19:49:59",
    updatedAt: "2022-11-13T20:49:59",
    status: "complete",
    log: "Log line 1\nLog line 2\nLog line 3",
  };

  test("renders without crashing", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, [mockJob]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/admin/jobs/logs/123"]}>
          <Routes>
            <Route path="/admin/jobs/logs/:id" element={<JobsLogPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Job Log")).toBeInTheDocument();
    expect(await screen.findByText("ID")).toBeInTheDocument();
    expect(await screen.findByText("123")).toBeInTheDocument();
  });

  test("renders job details correctly", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, [mockJob]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/admin/jobs/logs/123"]}>
          <Routes>
            <Route path="/admin/jobs/logs/:id" element={<JobsLogPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("123")).toBeInTheDocument(); // Job ID
    expect(await screen.findByText("complete")).toBeInTheDocument(); // Status
    expect(
      await screen.findByText("11/13/2022, 7:49:59 PM"),
    ).toBeInTheDocument(); // CreatedAt
    expect(
      await screen.findByText("11/13/2022, 8:49:59 PM"),
    ).toBeInTheDocument(); // UpdatedAt
  });

  test("renders the log lines correctly", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, [mockJob]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/admin/jobs/logs/123"]}>
          <Routes>
            <Route path="/admin/jobs/logs/:id" element={<JobsLogPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Log line 1")).toBeInTheDocument();
    expect(await screen.findByText("Log line 2")).toBeInTheDocument();
    expect(await screen.findByText("Log line 3")).toBeInTheDocument();
  });

  test("renders invalid job correctly", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, [mockJob]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/admin/jobs/logs/999"]}>
          <Routes>
            <Route path="/admin/jobs/logs/:id" element={<JobsLogPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Job not found.")).toBeInTheDocument();
  });
});
