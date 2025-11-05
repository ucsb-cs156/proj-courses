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
    const useBackendMutationSpy = vi.spyOn(
      useBackend,
      "useBackendMutation"
    );
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
});
