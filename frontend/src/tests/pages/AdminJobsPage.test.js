import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
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
  // 用以下测试替换你现有的pagination测试

  test("pagination prev button disabled on first page", async () => {
    const paginatedData = {
      content: jobsFixtures.sixJobs,
      totalPages: 2,
      number: 0, // This matches component's initial page state
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
      // Test page === 0 condition - component starts at page 0, so prev should be disabled
      expect(prevButton.closest(".page-item")).toHaveClass("disabled");
    });
  });

  test("pagination next button disabled on last page", async () => {
    const paginatedData = {
      content: jobsFixtures.sixJobs,
      totalPages: 1, // Only 1 page total, so next should be disabled
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
      // Test page + 1 >= totalPages condition (0 + 1 >= 1 = true)
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
      // Test idx + 1 calculation
      expect(screen.getByTestId("pagination-button-1")).toHaveTextContent("1");
      expect(screen.getByTestId("pagination-button-2")).toHaveTextContent("2");
      expect(screen.getByTestId("pagination-button-3")).toHaveTextContent("3");
    });
  });

  test("pagination active state works correctly", async () => {
    const paginatedData = {
      content: jobsFixtures.sixJobs,
      totalPages: 3,
      number: 0, // Component starts at page 0
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
      // Test idx === page logic - page 0 should be active (button 1)
      const page1 = screen.getByTestId("pagination-button-1"); // idx=0, so this is active
      const page2 = screen.getByTestId("pagination-button-2"); // idx=1, so this is not active

      expect(page1.closest(".page-item")).toHaveClass("active");
      expect(page2.closest(".page-item")).not.toHaveClass("active");
    });
  });

  // 在你现有的test文件最后添加这些测试来杀死所有surviving mutants

  // 这个测试专门针对 onClick={() => setPage((p) => Math.max(p - 1, 0))} 的所有mutants
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
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-next"));
    });

    await waitFor(() => {
      const page2Item = screen
        .getByTestId("pagination-button-2")
        .closest(".page-item");
      expect(page2Item).toHaveClass("active");
    });

    // 点击prev按钮 - 这会触发 setPage((p) => Math.max(p - 1, 0))
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-prev"));
    });

    // 验证页面确实改变了 - 证明onClick函数不是undefined，Math.max工作正常
    await waitFor(() => {
      const page1Item = screen
        .getByTestId("pagination-button-1")
        .closest(".page-item");
      expect(page1Item).toHaveClass("active");
    });

    // 再次点击prev按钮，应该停在第0页（测试Math.max的边界情况）
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-prev"));
    });

    await waitFor(() => {
      const page1Item = screen
        .getByTestId("pagination-button-1")
        .closest(".page-item");
      const prevItem = screen
        .getByTestId("pagination-prev")
        .closest(".page-item");
      expect(page1Item).toHaveClass("active"); // 仍然在第1页
      expect(prevItem).toHaveClass("disabled"); // prev按钮被禁用
    });
  });

  // 这个测试专门针对 setPage((p) => Math.min(p + 1, totalPages - 1)) 的mutant
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
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-next"));
    });

    await waitFor(() => {
      const page2Item = screen
        .getByTestId("pagination-button-2")
        .closest(".page-item");
      expect(page2Item).toHaveClass("active");
    });

    // 再次点击next按钮到最后一页 - 这会触发 setPage((p) => Math.min(p + 1, totalPages - 1))
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-next"));
    });

    // 验证到达了最后一页
    await waitFor(() => {
      const page3Item = screen
        .getByTestId("pagination-button-3")
        .closest(".page-item");
      const nextItem = screen
        .getByTestId("pagination-next")
        .closest(".page-item");
      expect(page3Item).toHaveClass("active");
      expect(nextItem).toHaveClass("disabled");
    });

    // 再次点击next，应该停在最后一页（测试Math.min和totalPages-1的边界）
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-next"));
    });

    await waitFor(() => {
      const page3Item = screen
        .getByTestId("pagination-button-3")
        .closest(".page-item");
      expect(page3Item).toHaveClass("active"); // 仍然在最后一页
    });
  });

  // 这个测试专门验证Math.max vs Math.min的区别，以及p-1 vs p+1的区别
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
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-button-3"));
    });

    await waitFor(() => {
      const page3Item = screen
        .getByTestId("pagination-button-3")
        .closest(".page-item");
      expect(page3Item).toHaveClass("active");
    });

    // 测试 p - 1 操作（不是 p + 1）
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-prev"));
    });

    await waitFor(() => {
      const page2Item = screen
        .getByTestId("pagination-button-2")
        .closest(".page-item");
      expect(page2Item).toHaveClass("active"); // 应该是2-1=1（显示为第2页）
    });

    // 测试 p + 1 操作（不是 p - 1）
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-next"));
    });

    await waitFor(() => {
      const page3Item = screen
        .getByTestId("pagination-button-3")
        .closest(".page-item");
      expect(page3Item).toHaveClass("active"); // 应该是1+1=2（显示为第3页）
    });

    // 继续测试next到边界
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-next"));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-next"));
    });

    // 现在应该在最后一页，测试totalPages-1 vs totalPages+1
    await waitFor(() => {
      const page5Item = screen
        .getByTestId("pagination-button-5")
        .closest(".page-item");
      const nextItem = screen
        .getByTestId("pagination-next")
        .closest(".page-item");
      expect(page5Item).toHaveClass("active");
      expect(nextItem).toHaveClass("disabled"); // 因为用的是totalPages-1，不是totalPages+1
    });
  });

  // 这个测试确保onClick handlers真的被调用了，而不是返回undefined
  test("pagination buttons have functional onClick handlers", async () => {
    const paginatedData = {
      content: jobsFixtures.sixJobs,
      totalPages: 4,
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

    // 测试prev按钮的onClick不是undefined（当前在第0页，点击应该没有效果）
    const initialPage1 = await screen.findByTestId("pagination-button-1");
    expect(initialPage1.closest(".page-item")).toHaveClass("active");

    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-prev"));
    });

    // 应该还在第1页，但证明onClick被调用了
    await waitFor(() => {
      const page1Item = screen
        .getByTestId("pagination-button-1")
        .closest(".page-item");
      expect(page1Item).toHaveClass("active");
    });

    // 测试next按钮的onClick确实改变了状态
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-next"));
    });

    await waitFor(() => {
      const page2Item = screen
        .getByTestId("pagination-button-2")
        .closest(".page-item");
      expect(page2Item).toHaveClass("active");
    });

    // 测试页面按钮的onClick
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-button-4"));
    });

    await waitFor(() => {
      const page4Item = screen
        .getByTestId("pagination-button-4")
        .closest(".page-item");
      expect(page4Item).toHaveClass("active");
    });
  });

  // 专门测试prev按钮在第0页的边界行为
  test("pagination prev button respects page 0 boundary", async () => {
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

    // 在第0页时，多次点击prev应该停留在第0页
    await waitFor(() => {
      const page1Item = screen
        .getByTestId("pagination-button-1")
        .closest(".page-item");
      const prevItem = screen
        .getByTestId("pagination-prev")
        .closest(".page-item");
      expect(page1Item).toHaveClass("active");
      expect(prevItem).toHaveClass("disabled");
    });

    // 即使disabled，也要测试点击行为（测试Math.max(p-1, 0)中的0边界）
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-prev"));
    });

    await waitFor(() => {
      const page1Item = screen
        .getByTestId("pagination-button-1")
        .closest(".page-item");
      expect(page1Item).toHaveClass("active"); // 应该仍然在第1页
    });
  });
  // 添加这两个测试来杀死最后的2个surviving mutants

  // 这个测试专门杀死 disabled={page === 0} → disabled={true} 的mutant
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
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-next"));
    });

    // 现在prev button应该是enabled的（page === 0 为false）
    // 如果mutant把条件改为disabled={true}，这个测试就会失败
    await waitFor(() => {
      const prevItem = screen
        .getByTestId("pagination-prev")
        .closest(".page-item");
      expect(prevItem).not.toHaveClass("disabled"); // 这里验证按钮是enabled的
    });

    // 再次验证可以实际点击prev按钮
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-prev"));
    });

    await waitFor(() => {
      const page1Item = screen
        .getByTestId("pagination-button-1")
        .closest(".page-item");
      expect(page1Item).toHaveClass("active");
    });
  });

  // 这个测试专门杀死 disabled={page + 1 >= totalPages} → disabled={true} 的mutant
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
      expect(nextItem).not.toHaveClass("disabled"); // 这里验证按钮是enabled的
    });

    // 验证可以实际点击next按钮
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-next"));
    });

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
    await act(async () => {
      fireEvent.click(screen.getByTestId("pagination-next"));
    });

    // 现在在最后一页，next button应该是disabled的（page + 1 >= totalPages 为true，因为2+1 >= 3）
    await waitFor(() => {
      const nextItem = screen
        .getByTestId("pagination-next")
        .closest(".page-item");
      expect(nextItem).toHaveClass("disabled");
    });
  });
});
