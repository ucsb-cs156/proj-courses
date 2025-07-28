import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";

import SectionSearchesIndexPageNotLoggedIn from "main/pages/SectionSearches/SectionSearchesIndexPageNotLoggedIn";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { allTheSubjects } from "fixtures/subjectFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import primaryFixtures from "fixtures/primaryFixtures";

import { useCurrentUser } from "main/utils/currentUser";
import { use } from "react";

jest.mock("main/utils/currentUser", () => ({
  useCurrentUser: () => ({
    data: { loggedIn: false, root: { user: { email: "test@example.com" } } },
  }),
  useLogout: () => ({ mutate: jest.fn() }),
  hasRole: (_user, _role) => false, // or customize per role
}));


const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const axiosMock = new AxiosMockAdapter(axios);
describe("SectionSearchesIndexPageNotLoggedIn tests", () => {
  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionSearchesIndexPageNotLoggedIn />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("calls UCSB section search api correctly with 1 section response", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/primaries")
      .reply(200, primaryFixtures.f24_math_lowerDiv);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionSearchesIndexPageNotLoggedIn />
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
  });
});
