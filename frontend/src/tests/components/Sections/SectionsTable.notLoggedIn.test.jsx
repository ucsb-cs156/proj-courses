import { vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SectionsTable from "main/components/Sections/SectionsTable";

import primaryFixtures from "fixtures/primaryFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";

// Mock useCurrentUser to return loggedOut from the start
vi.mock("main/utils/currentUser", () => ({
  useCurrentUser: () => ({
    data: { loggedIn: false, root: {} },
  }),
  useLogout: () => ({ mutate: vi.fn() }),
  hasRole: (_user, _role) => false,
}));

vi.mock("main/utils/useBackend", async () => ({
  useBackend: vi.fn(),
  useBackendMutation: vi.fn(),
}));

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => vi.fn(),
}));

vi.mock("react-toastify", async (importOriginal) => {
  const mockToast = vi.fn();
  mockToast.error = vi.fn();
  return {
    ...(await importOriginal()),
    toast: mockToast,
  };
});

describe("SectionsTable when user is not logged in", () => {
  let axiosMock;
  const queryClient = new QueryClient();

  beforeEach(() => {
    axiosMock = new AxiosMockAdapter(axios);
    vi.clearAllMocks();
  });

  afterEach(() => {
    axiosMock.restore();
  });

  it("should show not-logged-in span instead of action buttons when user is not logged in", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable
            sections={primaryFixtures.f24_math_lowerDiv}
            schedules={personalScheduleFixtures.oneF24PersonalSchedule}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    // Expand all rows to see the action column
    const expandAllRows = screen.getByTestId(`${testId}-expand-all-rows`);
    fireEvent.click(expandAllRows);

    // Wait for the expanded rows with not-logged-in indicators
    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-row-0-not-logged-in`),
      ).toBeInTheDocument();
    });

    // Verify that no "Add to Schedule" buttons are visible
    const addToScheduleButtons = screen.queryAllByTestId(
      new RegExp(`${testId}-cell.*-col-action-add-to-schedule-button`),
    );
    expect(addToScheduleButtons).toHaveLength(0);
  });
});
