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

  test("pagination prev button disabled on first page", async () => {
    const paginatedData = {
      content: jobsFixtures.sixJobs,
      totalPages: 2,
      number: 0,
      size: 10,
    };

    axiosMock.onGet("/api/jobs/all").reply(200, paginatedData);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const prevButton = screen.getByTestId("pagination-prev");
      expect(prevButton.closest(".page-item")).toHaveClass("disabled");
    });
  });

  test("pagination next button disabled on last page", async () => {
    const paginatedData = {
      content: jobsFixtures.sixJobs,
      totalPages: 1,
      number: 0,
      size: 10,
    };

    axiosMock.onGet("/api/jobs/all").reply(200, paginatedData);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const nextButton = screen.getByTestId("pagination-next");
      expect(nextButton.closest(".page-item")).toHaveClass("disabled");
    });
  });

  test("pagination buttons display correct numbers", async () => {
    const paginatedData = {
      content: jobsFixtures.sixJobs,
      totalPages: 3,
      number: 0,
      size: 10,
    };

    axiosMock.onGet("/api/jobs/all").reply(200, paginatedData);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("pagination-button-1")).toHaveTextContent("1");
    });

    await waitFor(() => {
      expect(screen.getByTestId("pagination-button-2")).toHaveTextContent("2");
    });

    await waitFor(() => {
      expect(screen.getByTestId("pagination-button-3")).toHaveTextContent("3");
    });
  });

  test("pagination active state works correctly", async () => {
    const paginatedData = {
      content: jobsFixtures.sixJobs,
      totalPages: 3,
      number: 0,
      size: 10,
    };

    axiosMock.onGet("/api/jobs/all").reply(200, paginatedData);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const page1 = screen.getByTestId("pagination-button-1");
      expect(page1.closest(".page-item")).toHaveClass("active");
    });

    await waitFor(() => {
      const page2 = screen.getByTestId("pagination-button-2");
      expect(page2.closest(".page-item")).not.toHaveClass("active");
    });
  });

  test("pagination prev button click handler works correctly", async () => {
    const paginatedData = {
      content: jobsFixtures.sixJobs,
      totalPages: 3,
      number: 0,
      size: 10,
    };

    axiosMock.onGet("/api/jobs/all").reply(200, paginatedData);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // 等待页面加载，组件默认从page 0开始
    await waitFor(() => {
      const page1Item = screen
        .getByTestId("pagination-button-1")
        .closest(".page-item");
      expect(page1Item).toHaveClass("active");
    });

    // 先点击next到第2页
    fireEvent.click(screen.getByTestId("pagination-next"));

    await waitFor(() => {
      const page2Item = screen
        .getByTestId("pagination-button-2")
        .closest(".page-item");
      expect(page2Item).toHaveClass("active");
    });

    // 点击prev按钮 - 这会触发 setPage((p) => Math.max(p - 1, 0))
    fireEvent.click(screen.getByTestId("pagination-prev"));

    // 验证页面确实改变了 - 证明onClick函数不是undefined，Math.max工作正常
    await waitFor(() => {
      const page1Item = screen
        .getByTestId("pagination-button-1")
        .closest(".page-item");
      expect(page1Item).toHaveClass("active");
    });

    // 再次点击prev按钮，应该停在第0页（测试Math.max的边界情况）
    fireEvent.click(screen.getByTestId("pagination-prev"));

    await waitFor(() => {
      const page1Item = screen
        .getByTestId("pagination-button-1")
        .closest(".page-item");
      expect(page1Item).toHaveClass("active");
    });

    await waitFor(() => {
      const prevItem = screen
        .getByTestId("pagination-prev")
        .closest(".page-item");
      expect(prevItem).toHaveClass("disabled");
    });
  });

  test("pagination next button click handler works correctly and respects totalPages boundary", async () => {
    const paginatedData = {
      content: jobsFixtures.sixJobs,
      totalPages: 3,
      number: 0,
      size: 10,
    };

    axiosMock.onGet("/api/jobs/all").reply(200, paginatedData);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // 等待页面加载，组件默认从page 0开始
    await waitFor(() => {
      const page1Item = screen
        .getByTestId("pagination-button-1")
        .closest(".page-item");
      expect(page1Item).toHaveClass("active");
    });

    // 点击next按钮到第2页
    fireEvent.click(screen.getByTestId("pagination-next"));

    await waitFor(() => {
      const page2Item = screen
        .getByTestId("pagination-button-2")
        .closest(".page-item");
      expect(page2Item).toHaveClass("active");
    });

    // 再次点击next按钮到最后一页 - 这会触发 setPage((p) => Math.min(p + 1, totalPages - 1))
    fireEvent.click(screen.getByTestId("pagination-next"));

    // 验证到达了最后一页
    await waitFor(() => {
      const page3Item = screen
        .getByTestId("pagination-button-3")
        .closest(".page-item");
      expect(page3Item).toHaveClass("active");
    });

    await waitFor(() => {
      const nextItem = screen
        .getByTestId("pagination-next")
        .closest(".page-item");
      expect(nextItem).toHaveClass("disabled");
    });

    // 再次点击next，应该停在最后一页（测试Math.min和totalPages-1的边界）
    fireEvent.click(screen.getByTestId("pagination-next"));

    await waitFor(() => {
      const page3Item = screen
        .getByTestId("pagination-button-3")
        .closest(".page-item");
      expect(page3Item).toHaveClass("active");
    });
  });

  test("pagination arithmetic operations work correctly", async () => {
    const paginatedData = {
      content: jobsFixtures.sixJobs,
      totalPages: 5,
      number: 0,
      size: 10,
    };

    axiosMock.onGet("/api/jobs/all").reply(200, paginatedData);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // 确认起始页面（page 0，显示为第1页）
    await waitFor(() => {
      const page1Item = screen
        .getByTestId("pagination-button-1")
        .closest(".page-item");
      expect(page1Item).toHaveClass("active");
    });

    // 导航到第3页（index 2）
    fireEvent.click(screen.getByTestId("pagination-button-3"));

    await waitFor(() => {
      const page3Item = screen
        .getByTestId("pagination-button-3")
        .closest(".page-item");
      expect(page3Item).toHaveClass("active");
    });

    // 测试 p - 1 操作（不是 p + 1）
    fireEvent.click(screen.getByTestId("pagination-prev"));

    await waitFor(() => {
      const page2Item = screen
        .getByTestId("pagination-button-2")
        .closest(".page-item");
      expect(page2Item).toHaveClass("active");
    });

    // 测试 p + 1 操作（不是 p - 1）
    fireEvent.click(screen.getByTestId("pagination-next"));

    await waitFor(() => {
      const page3Item = screen
        .getByTestId("pagination-button-3")
        .closest(".page-item");
      expect(page3Item).toHaveClass("active");
    });

    // 继续测试next到边界 - 从第3页开始点击next两次到第5页
    fireEvent.click(screen.getByTestId("pagination-next"));

    await waitFor(() => {
      const page4Item = screen
        .getByTestId("pagination-button-4")
        .closest(".page-item");
      expect(page4Item).toHaveClass("active");
    });

    fireEvent.click(screen.getByTestId("pagination-next"));

    // 现在应该在最后一页，测试totalPages-1 vs totalPages+1
    await waitFor(() => {
      const page5Item = screen
        .getByTestId("pagination-button-5")
        .closest(".page-item");
      expect(page5Item).toHaveClass("active");
    });

    await waitFor(() => {
      const nextItem = screen
        .getByTestId("pagination-next")
        .closest(".page-item");
      expect(nextItem).toHaveClass("disabled");
    });
  });

  test("pagination prev button is enabled when not on first page", async () => {
    const paginatedData = {
      content: jobsFixtures.sixJobs,
      totalPages: 3,
      number: 0,
      size: 10,
    };

    axiosMock.onGet("/api/jobs/all").reply(200, paginatedData);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // 首先确认在第1页时prev button是disabled的（page === 0 为true）
    await waitFor(() => {
      const prevItem = screen
        .getByTestId("pagination-prev")
        .closest(".page-item");
      expect(prevItem).toHaveClass("disabled");
    });

    // 点击到第2页
    fireEvent.click(screen.getByTestId("pagination-next"));

    // 现在prev button应该是enabled的（page === 0 为false）
    // 如果mutant把条件改为disabled={true}，这个测试就会失败
    await waitFor(() => {
      const prevItem = screen
        .getByTestId("pagination-prev")
        .closest(".page-item");
      expect(prevItem).not.toHaveClass("disabled");
    });

    // 再次验证可以实际点击prev按钮
    fireEvent.click(screen.getByTestId("pagination-prev"));

    await waitFor(() => {
      const page1Item = screen
        .getByTestId("pagination-button-1")
        .closest(".page-item");
      expect(page1Item).toHaveClass("active");
    });
  });

  test("pagination next button is enabled when not on last page", async () => {
    const paginatedData = {
      content: jobsFixtures.sixJobs,
      totalPages: 3,
      number: 0,
      size: 10,
    };

    axiosMock.onGet("/api/jobs/all").reply(200, paginatedData);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminJobsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // 在第1页时，next button应该是enabled的（page + 1 >= totalPages 为false，因为0+1 < 3）
    // 如果mutant把条件改为disabled={true}，这个测试就会失败
    await waitFor(() => {
      const nextItem = screen
        .getByTestId("pagination-next")
        .closest(".page-item");
      expect(nextItem).not.toHaveClass("disabled");
    });

    // 验证可以实际点击next按钮
    fireEvent.click(screen.getByTestId("pagination-next"));

    await waitFor(() => {
      const page2Item = screen
        .getByTestId("pagination-button-2")
        .closest(".page-item");
      expect(page2Item).toHaveClass("active");
    });

    // 继续到第2页，next还应该是enabled的（1+1 < 3）
    await waitFor(() => {
      const nextItem = screen
        .getByTestId("pagination-next")
        .closest(".page-item");
      expect(nextItem).not.toHaveClass("disabled");
    });

    // 到最后一页
    fireEvent.click(screen.getByTestId("pagination-next"));

    // 现在在最后一页，next button应该是disabled的（page + 1 >= totalPages 为true，因为2+1 >= 3）
    await waitFor(() => {
      const nextItem = screen
        .getByTestId("pagination-next")
        .closest(".page-item");
      expect(nextItem).toHaveClass("disabled");
    });
  });
});
