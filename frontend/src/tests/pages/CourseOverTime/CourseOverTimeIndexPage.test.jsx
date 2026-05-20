import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CourseOverTimeIndexPage from "main/pages/CourseOverTime/CourseOverTimeIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { threeSections } from "fixtures/sectionFixtures";
import { allTheSubjects } from "fixtures/subjectFixtures";
import userEvent from "@testing-library/user-event";

const mockToast = vi.fn();
vi.mock("react-toastify", async () => {
  const originalModule = await vi.importActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("CourseOverTimeIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("calls UCSB Course over time search api correctly with 3 section response", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/courseovertime/search")
      .reply(200, threeSections);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20222");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20222");
    const selectSubject = screen.getByLabelText("Subject Area");

    const expectedKey = "CourseOverTimeSearch.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    userEvent.selectOptions(selectSubject, "ANTH");
    const enterCourseNumber = screen.getByLabelText("Course Number");
    userEvent.type(enterCourseNumber, "130A");

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    axiosMock.resetHistory();

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    expect(axiosMock.history.get[0].params).toEqual({
      startQtr: "20222",
      endQtr: "20222",
      subjectArea: "ANTH",
      courseNumber: "130A",
    });

    expect(screen.getByText("ECE 1A -1")).toBeInTheDocument();
  });

  test("displays 'No courses found' message when search returns empty results", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock.onGet("/api/public/courseovertime/search").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20211");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20211");
    const selectSubject = screen.getByLabelText("Subject Area");

    const expectedKey = "CourseOverTimeSearch.Subject-option-ANTH";

    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    userEvent.selectOptions(selectSubject, "ANTH");
    const enterCourseNumber = screen.getByLabelText("Course Number");
    userEvent.type(enterCourseNumber, "130A");

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Loading courses.../i)).toBeInTheDocument();
      expect(
        screen.queryByText(
          /No courses were found with the specified criteria./i,
        ),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(/No courses were found with the specified criteria./i),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("ECE 1A -1")).not.toBeInTheDocument();
  });

  test("does not display 'No courses found' message before search is performed", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Subject Area")).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/No courses were found with the specified criteria./i),
    ).not.toBeInTheDocument();

    expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
  });

  test("does not display 'No courses found' message while loading", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock.onGet("/api/public/courseovertime/search").reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([200, []]), 100);
      });
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "CourseOverTimeSearch.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20211");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20211");
    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "ANTH");
    const enterCourseNumber = screen.getByLabelText("Course Number");
    userEvent.type(enterCourseNumber, "130A");

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Loading courses.../i)).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/No courses were found with the specified criteria./i),
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/No courses were found with the specified criteria./i),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
  });

  test("displays loading message while search is in progress", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock.onGet("/api/public/courseovertime/search").reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([200, threeSections]), 100);
      });
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "CourseOverTimeSearch.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20211");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20211");
    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "ANTH");
    const enterCourseNumber = screen.getByLabelText("Course Number");
    userEvent.type(enterCourseNumber, "130A");

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Loading courses.../i)).toBeInTheDocument();
    });

    expect(screen.queryByText("CourseId")).not.toBeInTheDocument();
    expect(screen.queryByText("ECE 1A -1")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("ECE 1A -1")).toBeInTheDocument();
    });

    expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
    expect(screen.getByText("CourseId")).toBeInTheDocument();
  });

  test("displays course table when search returns results", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/courseovertime/search")
      .reply(200, threeSections);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "CourseOverTimeSearch.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20211");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20211");
    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "ANTH");
    const enterCourseNumber = screen.getByLabelText("Course Number");
    userEvent.type(enterCourseNumber, "130A");

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("ECE 1A -1")).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/No courses were found with the specified criteria./i),
    ).not.toBeInTheDocument();

    expect(screen.getByText("CourseId")).toBeInTheDocument();
  });

  test("does not display table when search returns empty results", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock.onGet("/api/public/courseovertime/search").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "CourseOverTimeSearch.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20211");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20211");
    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "ANTH");
    const enterCourseNumber = screen.getByLabelText("Course Number");
    userEvent.type(enterCourseNumber, "130A");

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/No courses were found with the specified criteria./i),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("CourseId")).not.toBeInTheDocument();
  });
});
