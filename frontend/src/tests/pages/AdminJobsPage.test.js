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
import React from "react";

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
    axiosMock.onGet(/\/api\/jobs\/paginated.*/).reply((config) => {
      let page = 0;
      let pageSize = 10;
      if (config.params && config.params.page !== undefined) {
        page = Number(config.params.page);
      }
      if (config.params && config.params.pageSize !== undefined) {
        pageSize = Number(config.params.pageSize);
      }
      // Calculate totalPages based on jobsFixtures.sixJobs.length and pageSize
      const totalElements = jobsFixtures.sixJobs.length;
      const totalPages = Math.ceil(totalElements / pageSize);

      return [
        200,
        {
          content: jobsFixtures.sixJobs,
          totalPages,
          number: page,
          size: pageSize,
          totalElements,
        },
      ];
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

  test("AdminJobsPage uses correct localStorage keys for search form", async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Job Status");

    // Simulate user changing dropdowns
    userEvent.selectOptions(screen.getByLabelText("Sort By"), "updatedAt");
    userEvent.selectOptions(screen.getByLabelText("Sort Direction"), "DESC");
    userEvent.selectOptions(screen.getByLabelText("Page Size"), "20");

    expect(setItemSpy).toHaveBeenCalledWith(
      "JobsSearch.SortField",
      "updatedAt",
    );
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.SortDirection", "DESC");
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.PageSize", "20");
  });

  test("AdminJobsPage renders spacing divs with correct margin styles", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const divs = document.querySelectorAll("div");
    const hasMarginTopDiv = Array.from(divs).some(
      (div) => div.style && div.style.marginTop === "1rem",
    );
    expect(hasMarginTopDiv).toBe(true);

    const hasMarginBottomDiv = Array.from(divs).some(
      (div) => div.style && div.style.marginBottom === "1rem",
    );
    expect(hasMarginBottomDiv).toBe(true);
  });

  test("When localstorage is empty, fallback values are used", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => null);

    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    const useLocalStorageSpy = jest.spyOn(
      require("main/utils/useLocalStorage"),
      "default",
    );

    axiosMock.onGet("/api/jobs/paginated").reply(200, {
      content: jobsFixtures.sixJobs,
      totalPages: 3,
      number: 0,
      size: 10,
      totalElements: jobsFixtures.sixJobs.length,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Launch Jobs")).toBeInTheDocument();
    expect(await screen.findByText("Job Status")).toBeInTheDocument();

    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.SortField", "status");
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.SortDirection", "ASC");
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.PageSize", "5");

    const calls = useLocalStorageSpy.mock.calls;
    let counts = {};
    for (const call of calls) {
      const key = `${call[0]},${call[1]}`;
      counts[key] = counts[key] ? counts[key] + 1 : 1;
    }

    expect(counts).toEqual({
      "JobsSearch.PageSize,5": 6,
      "JobsSearch.SortDirection,ASC": 6,
      "JobsSearch.SortField,status": 6,
    });

    expect(axiosMock.history.get.length).toBe(4);
    const urls = axiosMock.history.get.map((req) => req.url);
    expect(urls).toContain("/api/systemInfo");
    expect(urls).toContain("/api/UCSBSubjects/all");
    expect(urls).toContain("/api/currentUser");
    expect(urls).toContain("/api/jobs/paginated");

    const updatesRequest = axiosMock.history.get.find(
      (req) => req.url && req.url.includes("/api/jobs/paginated"),
    );
    expect(updatesRequest.params).toEqual({
      page: 0,
      pageSize: 5,
      sortField: "status",
      sortDirection: "ASC",
    });
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-2")).toBeInTheDocument();

    expect(screen.queryByTestId("OurPagination-3")).not.toBeInTheDocument();

    userEvent.selectOptions(screen.getByLabelText("Page Size"), "20");

    expect(screen.queryByTestId("OurPagination-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("OurPagination-2")).not.toBeInTheDocument();
  });

  test("throws if page is undefined and optional chaining is removed", async () => {
    axiosMock.onGet("/api/jobs/paginated").reply(200, undefined);

    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [undefined, jest.fn()]);

    jest
      .spyOn(require("main/utils/useLocalStorage"), "default")
      .mockImplementation((initial) => [initial, jest.fn()]);

    // Expect render to throw if page is undefined and optional chaining is removed
    expect(() =>
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <AdminJobsPage />
          </MemoryRouter>
        </QueryClientProvider>,
      ),
    ).not.toThrow();
  });
});
