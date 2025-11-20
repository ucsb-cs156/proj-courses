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
    expect(screen.queryByText("No courses found.")).not.toBeInTheDocument();
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
    expect(screen.queryByText("No courses found.")).not.toBeInTheDocument();
  });

  test("displays 'No courses found' correctly with no course results", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/basicsearch")
      .reply(200, { classes: [] });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseDescriptionIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20222");
    const selectSubject = screen.getByLabelText("Subject Area");

    const expectedKey = "BasicSearch.Subject-option-PSTATW";

    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    expect(await screen.findByLabelText("Subject Area")).toHaveTextContent(
      "PSTATW",
    );

    userEvent.selectOptions(selectSubject, "PSTATW");
    const selectLevel = screen.getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "L");

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("No courses found.")).toBeInTheDocument();
    });
  });
});
