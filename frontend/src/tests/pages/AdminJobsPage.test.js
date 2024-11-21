import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { allTheSubjects } from "fixtures/subjectFixtures";
import userEvent from "@testing-library/user-event";

import AdminJobsPage from "main/pages/Admin/AdminJobsPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import jobsFixtures from "fixtures/jobsFixtures";

describe("AdminJobsPage tests", () => {
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

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(await screen.findByText("Launch Jobs")).toBeInTheDocument();
    expect(await screen.findByText("Job Status")).toBeInTheDocument();

    ["Test Job", "Update Courses Database", "Update Grade Info"].map(
      (jobName) => expect(screen.getByText(jobName)).toBeInTheDocument(),
    );

    const testId = "JobsTable";

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
  });

  test("user can submit a test job", async () => {
    axiosMock
      .onPost("/api/jobs/launch/testjob?fail=false&sleepMs=0")
      .reply(200, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Test Job")).toBeInTheDocument();

    const testJobButton = screen.getByText("Test Job");
    expect(testJobButton).toBeInTheDocument();
    testJobButton.click();

    expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();

    const sleepMsInput = screen.getByTestId("TestJobForm-sleepMs");
    const submitButton = screen.getByTestId("TestJobForm-Submit-Button");

    expect(sleepMsInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(sleepMsInput, { target: { value: "0" } });
    submitButton.click();

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].url).toBe(
      "/api/jobs/launch/testjob?fail=false&sleepMs=0",
    );
  });

  test("user can submit the update course data job", async () => {
    axiosMock
      .onPost(
        "/api/jobs/launch/updateCourses?quarterYYYYQ=20211&subjectArea=ANTH&ifStale=true",
      )
      .reply(200, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText("Update Courses Database"),
    ).toBeInTheDocument();

    const updateCoursesButton = screen.getByText("Update Courses Database");
    expect(updateCoursesButton).toBeInTheDocument();
    updateCoursesButton.click();

    expect(await screen.findByTestId("updateCourses")).toBeInTheDocument();
    const submitButton = screen.getByTestId("updateCourses");

    const expectedKey = "UpdateCoursesJobForm.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectQuarter = screen.getByTestId("UpdateCoursesJobForm.Quarter");
    userEvent.selectOptions(selectQuarter, "20211");
    const selectSubject = screen.getByLabelText("Subject Area");
    expect(selectSubject).toBeInTheDocument();
    userEvent.selectOptions(selectSubject, "ANTH");

    expect(submitButton).toBeInTheDocument();

    submitButton.click();

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].url).toBe(
      "/api/jobs/launch/updateCourses?quarterYYYYQ=20211&subjectArea=ANTH&ifStale=true",
    );
  });

  test("user can submit the update course data by quarter job", async () => {
    const url =
      "/api/jobs/launch/updateQuarterCourses?quarterYYYYQ=20222&ifStale=true";
    axiosMock.onPost(url).reply(200, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText("Update Courses Database by quarter"),
    ).toBeInTheDocument();

    const updateCoursesButton = screen.getByText(
      "Update Courses Database by quarter",
    );
    expect(updateCoursesButton).toBeInTheDocument();
    updateCoursesButton.click();

    const submitButton = screen.getByTestId("updateCoursesByQuarter");
    expect(
      await screen.findByTestId("updateCoursesByQuarter"),
    ).toBeInTheDocument();

    const selectQuarter = screen.getByTestId(
      "UpdateCoursesByQuarterJobForm.Quarter",
    );
    userEvent.selectOptions(selectQuarter, "20222");
    expect(submitButton).toBeInTheDocument();

    submitButton.click();

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].url).toBe(url);
  });

  test("user can submit the update course data by quarter range job", async () => {
    const url =
      "/api/jobs/launch/updateCoursesRangeOfQuarters?start_quarterYYYYQ=20212&end_quarterYYYYQ=20213&ifStale=true";
    axiosMock.onPost(url).reply(200, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText("Update Courses Database by quarter range"),
    ).toBeInTheDocument();

    const updateCoursesButton = screen.getByText(
      "Update Courses Database by quarter range",
    );
    expect(updateCoursesButton).toBeInTheDocument();
    updateCoursesButton.click();

    const submitButton = screen.getByTestId("updateCoursesByQuarterRange");
    expect(
      await screen.findByTestId("updateCoursesByQuarterRange"),
    ).toBeInTheDocument();

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20212");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20213");
    expect(submitButton).toBeInTheDocument();

    submitButton.click();

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].url).toBe(url);
  });

  test("user can submit update grade info", async () => {
    const url = "/api/jobs/launch/uploadGradeData";
    axiosMock.onPost(url).reply(200, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Update Grades")).toBeInTheDocument();

    const updateGradeButton = screen.getByText("Update Grade Info");
    expect(updateGradeButton).toBeInTheDocument();
    updateGradeButton.click();

    const submitGradeButton = screen.getByTestId("updateGradeInfoSubmit");
    expect(submitGradeButton).toBeInTheDocument();

    submitGradeButton.click();

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    expect(axiosMock.history.post[0].url).toBe(url);
  });
  test("user can clear job logs", async () => {
    const url = "/api/jobs/all";
    axiosMock.onDelete(url).reply(200, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Clear Job Logs")).toBeInTheDocument();

    const clearJobLogsButton = screen.getByText("Clear Job Logs");
    expect(clearJobLogsButton).toBeInTheDocument();
    clearJobLogsButton.click();

    const submitClearJobLogsButton = screen.getByTestId("clearJobLogsButn");
    expect(submitClearJobLogsButton).toBeInTheDocument();
    submitClearJobLogsButton.click();

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].url).toBe(url);
  });
});
