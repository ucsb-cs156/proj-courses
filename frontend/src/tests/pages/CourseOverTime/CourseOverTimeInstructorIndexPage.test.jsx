import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import * as useBackend from "main/utils/useBackend.jsx";

import CourseOverTimeInstructorIndexPage from "main/pages/CourseOverTime/CourseOverTimeInstructorIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { oneSection, threeSections } from "fixtures/sectionFixtures";
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

describe("CourseOverTimeInstructorIndexPage tests", () => {
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
          <CourseOverTimeInstructorIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("calls UCSB Course over time search api correctly with 3 section response", async () => {
    const useBackendMutationSpy = vi.spyOn(useBackend, "useBackendMutation");
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/courseovertime/instructorsearch")
      .reply(200, threeSections);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeInstructorIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20222");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20222");
    const enterInstructor = screen.getByLabelText("Instructor Name");
    userEvent.type(enterInstructor, "CONRAD");
    const selectCheckbox = screen.getByTestId(
      "CourseOverTimeInstructorSearchForm-checkbox",
    );
    userEvent.click(selectCheckbox);

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
      instructor: "CONRAD",
      lectureOnly: true,
    });
    expect(axiosMock.history.get[0].url).toBe(
      "/api/public/courseovertime/instructorsearch",
    );

    expect(useBackendMutationSpy).toHaveBeenCalledWith(
      expect.any(Function),
      { onSuccess: expect.any(Function) },
      [],
    );

    expect(screen.getByText("COMP ENGR SEMINAR")).toBeInTheDocument();
  });

  test("displays 'No courses found' message when search returns empty results", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/courseovertime/instructorsearch")
      .reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeInstructorIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20222");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20222");
    const enterInstructor = screen.getByLabelText("Instructor Name");
    userEvent.type(enterInstructor, "CONRADDD");

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

    expect(screen.queryByText("ADV APP PROGRAM")).not.toBeInTheDocument();
  });

  test("does not display 'No courses found' message before search is performed", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeInstructorIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Instructor Name")).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/No courses were found with the specified criteria./i),
    ).not.toBeInTheDocument();

    expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
  });

  test("does not display 'No courses found' message while loading", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock.onGet("/api/public/courseovertime/instructorsearch").reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([200, []]), 100);
      });
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeInstructorIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20222");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20222");
    const enterInstructor = screen.getByLabelText("Instructor Name");
    userEvent.type(enterInstructor, "CONRADDD");

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
    axiosMock.onGet("/api/public/courseovertime/instructorsearch").reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([200, oneSection]), 100);
      });
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeInstructorIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20222");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20222");
    const enterInstructor = screen.getByLabelText("Instructor Name");
    userEvent.type(enterInstructor, "CONRAD P T");

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Loading courses.../i)).toBeInTheDocument();
    });

    expect(screen.queryByText("CourseId")).not.toBeInTheDocument();
    expect(screen.queryByText("ADV APP PROGRAM")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Title")).toBeInTheDocument();
    });

    expect(screen.queryByText(/Loading courses.../i)).not.toBeInTheDocument();
    expect(screen.getByText("CourseId")).toBeInTheDocument();
  });

  test("displays course table when search returns results", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/courseovertime/instructorsearch")
      .reply(200, oneSection);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeInstructorIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20222");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20222");
    const enterInstructor = screen.getByLabelText("Instructor Name");
    userEvent.type(enterInstructor, "CONRAD P T");

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("CourseId")).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/No courses were found with the specified criteria./i),
    ).not.toBeInTheDocument();

    expect(screen.getByText("CourseId")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  test("does not display ConvertedSectionTable when search returns empty results", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/courseovertime/instructorsearch")
      .reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeInstructorIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20222");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20222");
    const enterInstructor = screen.getByLabelText("Instructor Name");
    userEvent.type(enterInstructor, "CONRADDD");

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/No courses were found with the specified criteria./i),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("CourseId")).not.toBeInTheDocument();
    expect(screen.queryByText("Title")).not.toBeInTheDocument();
  });
});
