import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import PersonalSchedulesWeeklyViewPage from "main/pages/PersonalSchedules/PersonalSchedulesWeeklyViewPage";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

// Debug helper function
const debug = (message, data) => {
  console.log(`[DEBUG] ${message}:`, data);
};

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      debug("Navigate called with", x);
      mockNavigate(x);
      return null;
    },
    useNavigate: () => mockNavigate,
  };
});

describe("PersonalSchedulesWeeklyViewPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);
    mockNavigate.mockClear();
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("renders without crashing for regular user", () => {
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/personalschedules/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesWeeklyViewPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    // Add a basic assertion to ensure rendering completes
    expect(screen.getByText("Weekly Schedule View")).toBeInTheDocument();
  });

  test("shows the correct info for admin users", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    debug("Setting up API mocks for admin user test");
    axiosMock
      .onGet(`/api/personalschedules?id=17`)
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);
    axiosMock
      .onGet(`/api/personalSections/all?psId=17`)
      .reply(200, personalSectionsFixtures.threePersonalSections);

    debug("Rendering component for admin user test");
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesWeeklyViewPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      debug("Checking for Weekly Schedule View text in admin test");
      expect(screen.getByText("Weekly Schedule View")).toBeInTheDocument();
    });

    await waitFor(() => {
      debug(
        "Checking for schedule name in admin test",
        personalScheduleFixtures.onePersonalScheduleDiffId.name,
      );
      expect(
        screen.getByText(
          personalScheduleFixtures.onePersonalScheduleDiffId.name,
        ),
      ).toBeInTheDocument();
    });

    // Check for Back to Details button
    debug("Looking for back button in admin test");
    const backButton = screen.getByRole("button", { name: /back to details/i });
    expect(backButton).toBeInTheDocument();

    // Check for SchedulerPanel
    debug("Checking SchedulerPanel in admin test");
    expect(
      screen.getByTestId("SchedulerPanel-Monday-column"),
    ).toBeInTheDocument();

    // Check for day titles
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    days.forEach((day) => {
      debug(`Checking day title for ${day} in admin test`);
      expect(
        screen.getByTestId(`SchedulerPanel-${day}-title`),
      ).toBeInTheDocument();
    });

    // Check for time slots
    const timeSlots = [
      "8-AM",
      "9-AM",
      "10-AM",
      "11-AM",
      "12-PM",
      "1-PM",
      "2-PM",
      "3-PM",
      "4-PM",
      "5-PM",
    ];
    timeSlots.forEach((time) => {
      debug(`Checking time slot for ${time} in admin test`);
      expect(
        screen.getByTestId(`SchedulerPanel-${time}-title`),
      ).toBeInTheDocument();
    });

    // Check for specific course events
    await waitFor(() => {
      debug("Checking for course event ECE 1A (0100) in admin test");
      expect(screen.getByText("ECE 1A (0100)")).toBeInTheDocument();
    });
  });

  test("navigates back to details page when back button is clicked", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock
      .onGet(`/api/personalschedules?id=17`)
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);
    axiosMock
      .onGet(`/api/personalSections/all?psId=17`)
      .reply(200, personalSectionsFixtures.threePersonalSections);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesWeeklyViewPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Weekly Schedule View")).toBeInTheDocument();
    });

    const backButton = screen.getByRole("button", { name: /back to details/i });
    debug("Clicking back button");
    backButton.click();

    await waitFor(() => {
      debug(
        "Checking navigation after back button click",
        mockNavigate.mock.calls,
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        "/personalschedules/details/17",
      );
    });
  });

  test("handles empty personal sections data", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock
      .onGet(`/api/personalschedules?id=17`)
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);
    axiosMock.onGet(`/api/personalSections/all?psId=17`).reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesWeeklyViewPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Weekly Schedule View")).toBeInTheDocument();
    });

    // Should still show the schedule name
    await waitFor(() => {
      expect(
        screen.getByText(
          personalScheduleFixtures.onePersonalScheduleDiffId.name,
        ),
      ).toBeInTheDocument();
    });

    // Should show empty scheduler panel (headers, etc. but no events)
    expect(
      screen.getByTestId("SchedulerPanel-Monday-column"),
    ).toBeInTheDocument();
  });

  test("handles error in personal sections data", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock
      .onGet(`/api/personalschedules?id=17`)
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);
    axiosMock.onGet(`/api/personalSections/all?psId=17`).reply(500, {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesWeeklyViewPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Weekly Schedule View")).toBeInTheDocument();
    });

    // Should still show the schedule name
    await waitFor(() => {
      expect(
        screen.getByText(
          personalScheduleFixtures.onePersonalScheduleDiffId.name,
        ),
      ).toBeInTheDocument();
    });

    // Scheduler panel should NOT be present due to the error
    expect(
      screen.queryByTestId("SchedulerPanel-Monday-column"),
    ).not.toBeInTheDocument();
  });

  test("handles error in personal schedule data", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock.onGet(`/api/personalschedules?id=17`).reply(500, {});
    axiosMock
      .onGet(`/api/personalSections/all?psId=17`)
      .reply(200, personalSectionsFixtures.threePersonalSections);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesWeeklyViewPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Weekly Schedule View")).toBeInTheDocument();
    });

    // Schedule name might not be available if the personal schedule fetch failed
    // So, we don't assert for it here.

    // Scheduler panel should NOT be present due to the error
    expect(
      screen.queryByTestId("SchedulerPanel-Monday-column"),
    ).not.toBeInTheDocument();
  });
});
