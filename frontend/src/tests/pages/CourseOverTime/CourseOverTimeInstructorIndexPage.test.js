import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CourseOverTimeInstructorIndexPage from "main/pages/CourseOverTime/CourseOverTimeInstructorIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import {
  threeSections,
  differentQuarterSections,
} from "fixtures/sectionFixtures";
import { allTheSubjects } from "fixtures/subjectFixtures";
import userEvent from "@testing-library/user-event";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("CourseOverTimeInstructorIndexPage tests", () => {
  const saveProcessEnv = process.env;
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    process.env = {};
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  afterEach(() => {
    process.env = saveProcessEnv;
  });

  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    process.env = {
      REACT_APP_START_QTR: "20204",
      REACT_APP_END_QTR: "20224",
    };
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeInstructorIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(
      screen.getByText("Welcome to the UCSB Course Instructor Search!"),
    ).toBeInTheDocument();
  });

  test("calls UCSB Course over time search api correctly with 3 section response", async () => {
    process.env = {
      REACT_APP_START_QTR: "20204",
      REACT_APP_END_QTR: "20224",
    };
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

    expect(screen.getByText("ECE 1A")).toBeInTheDocument();
  });

  test("passes sorted sections to SectionsOverTimeTable", async () => {
    process.env = {
      REACT_APP_START_QTR: "20204",
      REACT_APP_END_QTR: "20224",
    };
    // Mock the response of the API call with differentQuarterSections data
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/courseovertime/instructorsearch")
      .reply(200, differentQuarterSections);

    const spy = jest.spyOn(
      require("main/components/Sections/SectionsInstructorTable"),
      "default",
    );

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

    // Check that SectionsOverTimeTable received the sorted sections data
    const sortedSections = differentQuarterSections.sort((a, b) =>
      b.courseInfo.quarter.localeCompare(a.courseInfo.quarter),
    );
    expect(spy).toHaveBeenCalledWith(
      { sections: sortedSections },
      expect.anything(),
    );

    spy.mockRestore();
  });
});
