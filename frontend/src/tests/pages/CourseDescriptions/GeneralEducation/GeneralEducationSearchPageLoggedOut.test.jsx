import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";

import GeneralEducationSearchPage from "main/pages/GeneralEducation/Search/GeneralEducationSearchPage";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import primaryFixtures from "fixtures/primaryFixtures";

vi.mock("main/utils/currentUser", async () => ({
  useCurrentUser: () => ({
    data: { loggedIn: false, root: { user: { email: "test@example.com" } } },
  }),
  useLogout: () => ({ mutate: vi.fn() }),
  hasRole: (_user, _role) => false, // or customize per role
}));

const mockToast = vi.fn();
vi.mock("react-toastify", async () => {
  const originalModule = await vi.importActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const axiosMock = new AxiosMockAdapter(axios);
describe("GeneralEducationSearchPage tests (logged out)", () => {
  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock.onGet("/api/public/generalEducationInfo").reply(200, [
      { requirementCode: "A1", requirementTranslation: "English" },
      { requirementCode: "B", requirementTranslation: "Foreign Language" },
    ]);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("calls GE section search api correctly with 1 section response", async () => {
    axiosMock
      .onGet("/api/public/primariesge")
      .reply(200, primaryFixtures.f24_math_lowerDiv);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20222");
    const selectSubject = screen.getByLabelText("General Education Area");

    const expectedKey = "GEAreaSearch.Area-option-A1";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    userEvent.selectOptions(selectSubject, "A1");

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    axiosMock.resetHistory();

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    expect(axiosMock.history.get[0].params).toEqual({
      qtr: "20222",
      area: "A1",
    });

    const expectedFirstRow = screen.getByTestId(
      "SectionsTable-cell-row-0-col-courseId",
    );
    expect(expectedFirstRow).toBeInTheDocument();
    expect(expectedFirstRow).toHaveTextContent("MATH 2A");
  });
});
