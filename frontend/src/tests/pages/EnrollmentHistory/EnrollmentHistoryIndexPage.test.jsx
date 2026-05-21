import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";

import EnrollmentHistoryIndexPage from "main/pages/EnrollmentHistory/EnrollmentHistoryIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { allTheSubjects } from "fixtures/subjectFixtures";
import { vi } from "vitest";

const mockToast = vi.fn();
vi.mock("react-toastify", () => {
  return {
    toast: (x) => mockToast(x),
  };
});

describe("EnrollmentHistoryIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  test("renders without crashing", () => {
    setupUserOnly();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EnrollmentHistoryIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(
      screen.getByText("UCSB Enrollment History Search"),
    ).toBeInTheDocument();
  });

  test("calls api correctly when form is submitted", async () => {
    setupUserOnly();
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

    const mockEnrollmentData = [
      {
        id: 1,
        yyyyq: "20211",
        courseId: "CMPSC     130A",
        enrollment: 50,
      },
    ];

    axiosMock
      .onGet("/api/public/enrollmenthistory/search")
      .reply(200, mockEnrollmentData);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EnrollmentHistoryIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("EnrollmentHistorySearchForm"),
      ).toBeInTheDocument();
    });

    userEvent.selectOptions(screen.getByLabelText("Quarter"), "20211");
    userEvent.selectOptions(screen.getByLabelText("Subject Area"), "CMPSC");
    userEvent.type(screen.getByLabelText("Course Number"), "130A");

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/"enrollment": 50/)).toBeInTheDocument();
    });

    expect(axiosMock.history.get.length).toBeGreaterThan(0);
    const searchRequest = axiosMock.history.get.find(
      (req) => req.url === "/api/public/enrollmenthistory/search",
    );

    expect(searchRequest).toBeDefined();
    expect(searchRequest.method.toUpperCase()).toEqual("GET");
    expect(searchRequest.params).toEqual({
      yyyyq: "20211",
      subjectArea: "CMPSC",
      courseNumber: "130A",
    });
  });
});
