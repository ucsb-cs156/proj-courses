import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";

import CourseDescriptionIndexPage from "main/pages/CourseDescriptions/CourseDescriptionIndexPage";
import { coursesFixtures } from "fixtures/courseFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { allTheSubjects } from "fixtures/subjectFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

const mockToast = vi.fn();
vi.mock("react-toastify", async () => {
  const originalModule = await vi.importActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("CourseDescriptionIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.spyOn(console, "error");
    console.error.mockImplementation(() => null);
  });

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
          <CourseDescriptionIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("calls UCSB Curriculum api correctly with 1 course response", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/basicsearch")
      .reply(200, { classes: coursesFixtures.oneCourse });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDescriptionIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20211");
    const selectSubject = screen.getByLabelText("Subject Area");

    const expectedKey = "BasicSearch.Subject-option-ANTH";

    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    expect(await screen.findByLabelText("Subject Area")).toHaveTextContent(
      "ANTH",
    );

    userEvent.selectOptions(selectSubject, "ANTH");
    const selectLevel = screen.getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "G");

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    axiosMock.resetHistory();

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    expect(axiosMock.history.get[0].params).toEqual({
      qtr: "20211",
      dept: "ANTH",
      level: "G",
    });

    expect(screen.getByText("CMPSC")).toBeInTheDocument();
  });

  test("displays 'No courses found' message when search returns empty results", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock.onGet("/api/public/basicsearch").reply(200, { classes: [] });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDescriptionIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20211");
    const selectSubject = screen.getByLabelText("Subject Area");

    const expectedKey = "BasicSearch.Subject-option-ANTH";

    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    userEvent.selectOptions(selectSubject, "ANTH");
    const selectLevel = screen.getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "G");

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

    expect(screen.queryByText("CMPSC")).not.toBeInTheDocument();
  });

  test("does not display 'No courses found' message before search is performed", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDescriptionIndexPage />
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
    axiosMock.onGet("/api/public/basicsearch").reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([200, { classes: [] }]), 100);
      });
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDescriptionIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "BasicSearch.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

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
    axiosMock.onGet("/api/public/basicsearch").reply(() => {
      return new Promise((resolve) => {
        setTimeout(
          () => resolve([200, { classes: coursesFixtures.oneCourse }]),
          100,
        );
      });
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDescriptionIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20211");

    const expectedKey = "BasicSearch.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Loading courses.../i)).toBeInTheDocument();
    });

    expect(screen.queryByText("Course Id")).not.toBeInTheDocument();
    expect(screen.queryByText("CMPSC")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("CMPSC")).toBeInTheDocument();
    });

    expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
    expect(screen.getByText("Course Id")).toBeInTheDocument();
  });

  test("displays course table when search returns results", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/basicsearch")
      .reply(200, { classes: coursesFixtures.oneCourse });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDescriptionIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("CMPSC")).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/No courses were found with the specified criteria./i),
    ).not.toBeInTheDocument();

    expect(screen.getByText("Course Id")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  test("does not display BasicCourseTable when search returns empty results", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock.onGet("/api/public/basicsearch").reply(200, { classes: [] });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDescriptionIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "BasicSearch.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/No courses were found with the specified criteria./i),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Course Id")).not.toBeInTheDocument();
    expect(screen.queryByText("Title")).not.toBeInTheDocument();
  });
});
