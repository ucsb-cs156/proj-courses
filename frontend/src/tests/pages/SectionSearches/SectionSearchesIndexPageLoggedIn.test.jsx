import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";

import SectionSearchesIndexPageLoggedIn from "main/pages/SectionSearches/SectionSearchesIndexPageLoggedIn";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { allTheSubjects } from "fixtures/subjectFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import primaryFixtures from "fixtures/primaryFixtures";

const mockToast = vi.fn();
vi.mock("react-toastify", () => {
  const originalModule = vi.importActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("SectionSearchesIndexPageLoggedIn tests", () => {
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
          <SectionSearchesIndexPageLoggedIn />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("calls UCSB section search api correctly with 1 section response", async () => {
    const useBackendSpy = vi.spyOn(
      require("main/utils/useBackend"),
      "useBackend",
    );
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/primaries")
      .reply(200, primaryFixtures.f24_math_lowerDiv);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionSearchesIndexPageLoggedIn />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20222");
    const selectSubject = screen.getByLabelText("Subject Area");

    const expectedKey = "BasicSearch.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
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
      qtr: "20222",
      dept: "ANTH",
      level: "G",
    });

    const expectedFirstRow = screen.getByTestId(
      "SectionsTable-cell-row-0-col-courseId",
    );
    expect(expectedFirstRow).toBeInTheDocument();
    expect(expectedFirstRow).toHaveTextContent("MATH 2A");

    expect(useBackendSpy).toHaveBeenCalledWith(
      ["/api/personalschedules/all"],
      { method: "GET", url: "/api/personalschedules/all" },
      [],
    );
  });
});
