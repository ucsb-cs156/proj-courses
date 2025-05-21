/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import AdminJobsPage, { REFRESH_MS } from "main/pages/Admin/AdminJobsPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import jobsFixtures from "fixtures/jobsFixtures";
import { allTheSubjects } from "fixtures/subjectFixtures";

jest.setTimeout(30000);

describe("AdminJobsPage tests", () => {
  const queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);

  afterEach(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();

    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
  });

  test("renders without crashing", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, {
      content: jobsFixtures.sixJobs,
      totalPages: 1,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Launch Jobs")).toBeInTheDocument();
    expect(await screen.findByText("Job Status")).toBeInTheDocument();
  });

  test("user can submit a test job", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, {
      content: jobsFixtures.sixJobs,
      totalPages: 1,
    });
    axiosMock
      .onPost("/api/jobs/launch/testjob?fail=false&sleepMs=0")
      .reply(200, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const testJobButton = await screen.findByText("Test Job");
    await userEvent.click(testJobButton);

    const sleepMsInput = await screen.findByTestId("TestJobForm-sleepMs");
    const submitButton = screen.getByTestId("TestJobForm-Submit-Button");

    await act(async () => {
      fireEvent.change(sleepMsInput, { target: { value: "0" } });
      submitButton.click();
    });

    await waitFor(() =>
      expect(axiosMock.history.post).toHaveLength(1)
    );
    expect(axiosMock.history.post[0].url).toBe(
      "/api/jobs/launch/testjob?fail=false&sleepMs=0"
    );
  });

  test("user can submit the update course data job", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, {
      content: jobsFixtures.sixJobs,
      totalPages: 1,
    });
    axiosMock
      .onPost(
        "/api/jobs/launch/updateCourses?quarterYYYYQ=20211&subjectArea=ANTH&ifStale=true"
      )
      .reply(200, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await screen.findByText("Update Courses Database");
    await userEvent.click(screen.getByText("Update Courses Database"));

    userEvent.selectOptions(
      screen.getByTestId("UpdateCoursesJobForm.Quarter"),
      "20211"
    );
    userEvent.selectOptions(screen.getByLabelText("Subject Area"), "ANTH");

    await act(async () => {
      screen.getByTestId("updateCourses").click();
    });

    await waitFor(() =>
      expect(axiosMock.history.post).toHaveLength(1)
    );
    expect(axiosMock.history.post[0].url).toBe(
      "/api/jobs/launch/updateCourses?quarterYYYYQ=20211&subjectArea=ANTH&ifStale=true"
    );
  });

  test("user can submit the update course data by quarter job", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, {
      content: jobsFixtures.sixJobs,
      totalPages: 1,
    });
    const url =
      "/api/jobs/launch/updateQuarterCourses?quarterYYYYQ=20222&ifStale=true";
    axiosMock.onPost(url).reply(200, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await screen.findByText("Update Courses Database by quarter");
    await userEvent.click(screen.getByText("Update Courses Database by quarter"));

    userEvent.selectOptions(
      screen.getByTestId("UpdateCoursesByQuarterJobForm.Quarter"),
      "20222"
    );

    await act(async () => {
      screen.getByTestId("updateCoursesByQuarter").click();
    });

    await waitFor(() =>
      expect(axiosMock.history.post).toHaveLength(1)
    );
    expect(axiosMock.history.post[0].url).toBe(url);
  });

  test("user can submit the update course data by quarter range job", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, {
      content: jobsFixtures.sixJobs,
      totalPages: 1,
    });
    const url =
      "/api/jobs/launch/updateCoursesRangeOfQuarters?start_quarterYYYYQ=20212&end_quarterYYYYQ=20213&ifStale=true";
    axiosMock.onPost(url).reply(200, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await screen.findByText("Update Courses Database by quarter range");
    await userEvent.click(
      screen.getByText("Update Courses Database by quarter range")
    );

    userEvent.selectOptions(screen.getByLabelText("Start Quarter"), "20212");
    userEvent.selectOptions(screen.getByLabelText("End Quarter"), "20213");

    await act(async () => {
      screen.getByTestId("updateCoursesByQuarterRange").click();
    });

    await waitFor(() =>
      expect(axiosMock.history.post).toHaveLength(1)
    );
    expect(axiosMock.history.post[0].url).toBe(url);
  });

  test("user can submit update grade info", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, {
      content: jobsFixtures.sixJobs,
      totalPages: 1,
    });
    const url = "/api/jobs/launch/uploadGradeData";
    axiosMock.onPost(url).reply(200, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await screen.findByText("Update Grade Info");
    await userEvent.click(screen.getByText("Update Grade Info"));
    await userEvent.click(screen.getByText("Update Grades"));

    await waitFor(() =>
      expect(axiosMock.history.post).toHaveLength(1)
    );
    expect(axiosMock.history.post[0].url).toBe(url);
  });

  test("user can purge all jobs in the JobsTable", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, {
      content: jobsFixtures.sixJobs,
      totalPages: 1,
    });
    axiosMock.onDelete("/api/jobs/all").reply(200, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await screen.findByText("Purge Job Log");
    await userEvent.click(screen.getByText("Purge Job Log"));

    await waitFor(() =>
      expect(axiosMock.history.delete).toHaveLength(1)
    );
    expect(axiosMock.history.delete[0].url).toBe("/api/jobs/all");
  });

  test("error fetching jobs displays error message", async () => {
    axiosMock.onGet("/api/jobs/all").reply(500);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Error fetching jobs/i)).toBeInTheDocument();
  });

  test("handles plain array data shape (Array.isArray)", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, jobsFixtures.sixJobs);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId("JobsTable-cell-row-0-col-id"))
      .toHaveTextContent("1");
  });

  test("auto-refresh triggers repeated fetchJobs calls", async () => {
    jest.useFakeTimers({ shouldClearNativeTimers: true });
    axiosMock.onGet("/api/jobs/all").reply(200, {
      content: jobsFixtures.sixJobs,
      totalPages: 1,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // on mount, only one /api/jobs/all call
    expect(
      axiosMock.history.get.filter(r => r.url === "/api/jobs/all")
    ).toHaveLength(1);

    // advance timers by the refresh interval
    jest.advanceTimersByTime(REFRESH_MS);
    jest.runOnlyPendingTimers();
    await waitFor(() =>
      expect(
        axiosMock.history.get.filter(r => r.url === "/api/jobs/all")
      ).toHaveLength(2)
    );
  });

  test("totalPages = 0 does not render pagination items", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, {
      content: jobsFixtures.sixJobs,
      totalPages: 0,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await screen.findByText("Launch Jobs");
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  test("totalPages = 1 does not render pagination items", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, {
      content: jobsFixtures.sixJobs,
      totalPages: 1,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await screen.findByText("Launch Jobs");
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  test("totalPages > 1 renders pagination items equal to totalPages", async () => {
    axiosMock.onGet("/api/jobs/all").reply(200, {
      content: jobsFixtures.sixJobs,
      totalPages: 3,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await screen.findByText("Launch Jobs");
    await waitFor(() =>
      expect(screen.getAllByRole("listitem")).toHaveLength(3)
    );
  });
});
