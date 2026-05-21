import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import EnrollmentHistoryIndexPage from "main/pages/EnrollmentHistory/EnrollmentHistoryIndexPage";
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

describe("EnrollmentHistoryIndexPage tests", () => {
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
          <EnrollmentHistoryIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("calls UCSB Course over time search api correctly with 3 section response", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/EnrollmentHistory/search")
      .reply(200, threeSections);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EnrollmentHistoryIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectStartQuarter, "20222");
    const selectSubject = screen.getByLabelText("Subject Area");

    const expectedKey = "EnrollmentHistorySearch.Subject-option-ANTH";
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
      yyyyq: "20222",
      subjectArea: "ANTH",
      courseNumber: "130A",
    });

    expect(screen.getByText("ECE 1A -1")).toBeInTheDocument();
  });
});
