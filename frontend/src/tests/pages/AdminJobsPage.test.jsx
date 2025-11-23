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
    axiosMock.onGet("/api/jobs/paginated").reply(200, {
      content: jobsFixtures.sixJobs,
      totalPages: 1,
    });
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
    ).toHaveTextContent("Hello World! from test job! Goodbye from test job!");
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
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
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

    expect(await screen.findByText("Update Grade Info")).toBeInTheDocument();

    const dropDownButton = screen.getByText("Update Grade Info");
    expect(dropDownButton).toBeInTheDocument();
    dropDownButton.click();

    const updateGradeButton = screen.getByText("Update Grades");
    expect(updateGradeButton).toBeInTheDocument();
    updateGradeButton.click();

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    expect(axiosMock.history.post[0].url).toBe(url);
  });

  test("user can purge all jobs in the JobsTable", async () => {
    axiosMock.onDelete("/api/jobs/all").reply(200, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Purge Job Log")).toBeInTheDocument();

    const purgeAllLogsButton = screen.getByText("Purge Job Log");
    expect(purgeAllLogsButton).toBeInTheDocument();
    purgeAllLogsButton.click();

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));

    expect(axiosMock.history.delete[0].url).toBe("/api/jobs/all");
  });

  test("handles invalid pageSize gracefully", async () => {
    // Set up localStorage with invalid pageSize
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation((key) => {
      if (key === "JobsSearch.PageSize") return ""; // Empty string should trigger fallback
      if (key === "JobsSearch.SortField") return "status";
      if (key === "JobsSearch.SortDirection") return "DESC";
      return null;
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(axiosMock.history.get.length).toBeGreaterThan(0),
    );

    // Check that the API was called with pageSize=10 (the fallback value)
    const jobsApiCall = axiosMock.history.get.find((call) =>
      call.url.includes("/api/jobs/paginated"),
    );
    expect(jobsApiCall).toBeDefined();
    expect(jobsApiCall.params.pageSize).toBe(10);

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
  });

  test("passes correct sort parameters to API", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(axiosMock.history.get.length).toBeGreaterThan(0),
    );

    // Check that the API was called with correct sort parameters
    const jobsApiCall = axiosMock.history.get.find((call) =>
      call.url.includes("/api/jobs/paginated"),
    );
    expect(jobsApiCall).toBeDefined();
    expect(jobsApiCall.params.sortField).toBe("status");
    expect(jobsApiCall.params.sortDirection).toBe("DESC");
    expect(jobsApiCall.params.page).toBe(0);
    expect(jobsApiCall.params.pageSize).toBe(10);
  });

  test("converts pageSize from string to integer", async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation((key) => {
      if (key === "JobsSearch.PageSize") return "50";
      if (key === "JobsSearch.SortField") return "status";
      if (key === "JobsSearch.SortDirection") return "DESC";
      return null;
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(axiosMock.history.get.length).toBeGreaterThan(0),
    );

    const jobsApiCall = axiosMock.history.get.find((call) =>
      call.url.includes("/api/jobs/paginated"),
    );
    expect(jobsApiCall).toBeDefined();
    expect(jobsApiCall.params.pageSize).toBe(50);
    expect(typeof jobsApiCall.params.pageSize).toBe("number");

    getItemSpy.mockRestore();
  });

  test("converts page number correctly (selectedPage - 1)", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(axiosMock.history.get.length).toBeGreaterThan(0),
    );

    // selectedPage starts at 1, so API should get page 0
    const jobsApiCall = axiosMock.history.get.find((call) =>
      call.url.includes("/api/jobs/paginated"),
    );
    expect(jobsApiCall).toBeDefined();
    expect(jobsApiCall.params.page).toBe(0);
    expect(jobsApiCall.params.page).not.toBe(1);
  });

  test("uses correct localStorage keys", async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(axiosMock.history.get.length).toBeGreaterThan(0),
    );

    // Verify that the correct localStorage keys were accessed
    expect(getItemSpy).toHaveBeenCalledWith("JobsSearch.SortField");
    expect(getItemSpy).toHaveBeenCalledWith("JobsSearch.SortDirection");
    expect(getItemSpy).toHaveBeenCalledWith("JobsSearch.PageSize");

    getItemSpy.mockRestore();
  });

  test("uses default pageSize value of '10' when localStorage is empty", async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    // Mock localStorage to return null for all keys (simulating first time use)
    getItemSpy.mockReturnValue(null);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(axiosMock.history.get.length).toBeGreaterThan(0),
    );

    // Verify that the default value "10" was set in localStorage
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.PageSize", "10");
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.SortField", "status");
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.SortDirection", "DESC");

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
  });

  test("verifies correct localStorage key is used for SortField", async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    // Mock to return null so default value is used
    getItemSpy.mockReturnValue(null);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(axiosMock.history.get.length).toBeGreaterThan(0),
    );

    // Verify the exact localStorage key "JobsSearch.SortField" is used
    const sortFieldCalls = setItemSpy.mock.calls.filter(
      (call) => call[0] === "JobsSearch.SortField",
    );
    expect(sortFieldCalls.length).toBeGreaterThan(0);
    expect(sortFieldCalls[0][1]).toBe("status");

    // Also verify that we did NOT use an empty string as the key
    const emptyKeyCalls = setItemSpy.mock.calls.filter(
      (call) => call[0] === "" && call[1] === "status",
    );
    expect(emptyKeyCalls.length).toBe(0);

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
  });

  test("verifies pageSize default is '10' not empty string", async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    // Return null for all keys to trigger default values
    getItemSpy.mockReturnValue(null);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(axiosMock.history.get.length).toBeGreaterThan(0),
    );

    // Find the call where PageSize was set
    const pageSizeCalls = setItemSpy.mock.calls.filter(
      (call) => call[0] === "JobsSearch.PageSize",
    );
    expect(pageSizeCalls.length).toBeGreaterThan(0);
    // Verify it was set to "10" and NOT to an empty string ""
    expect(pageSizeCalls[0][1]).toBe("10");
    expect(pageSizeCalls[0][1]).not.toBe("");

    // Also verify the API received the correct numeric value
    const jobsApiCall = axiosMock.history.get.find((call) =>
      call.url.includes("/api/jobs/paginated"),
    );
    expect(jobsApiCall.params.pageSize).toBe(10);

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
  });
});
