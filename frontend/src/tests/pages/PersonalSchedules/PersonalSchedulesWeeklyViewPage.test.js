import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import PersonalSchedulesWeeklyViewPage from "main/pages/PersonalSchedules/PersonalSchedulesWeeklyViewPage";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

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
    expect(screen.getByText("Weekly Schedule View")).toBeInTheDocument();
  });

  test("renders correctly for admin user", async () => {
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

    expect(screen.getByText("Weekly Schedule View")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(
          personalScheduleFixtures.onePersonalScheduleDiffId.name,
        ),
      ).toBeInTheDocument();
    });

    const backButton = screen.getByRole("button", { name: /Back to Details/i });
    expect(backButton).toBeInTheDocument();

    expect(
      screen.getByTestId("SchedulerPanel-Monday-column"),
    ).toBeInTheDocument();

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    days.forEach((day) => {
      expect(
        screen.getByTestId(`SchedulerPanel-${day}-title`),
      ).toBeInTheDocument();
    });

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
      expect(
        screen.getByTestId(`SchedulerPanel-${time}-title`),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("ECE 1A (0100)")).toBeInTheDocument();
    });

    fireEvent.click(backButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/personalschedules/details/17",
      );
    });
  });

  test("shows the correct info for admin users", async () => {
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

    await waitFor(() => {
      expect(
        screen.getByText(
          personalScheduleFixtures.onePersonalScheduleDiffId.name,
        ),
      ).toBeInTheDocument();
    });

    // Check for Back to Details button
    const backButton = screen.getByRole("button", { name: /back to details/i });
    expect(backButton).toBeInTheDocument();

    // Check for SchedulerPanel
    expect(
      screen.getByTestId("SchedulerPanel-Monday-column"),
    ).toBeInTheDocument();

    // Check for day titles
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    days.forEach((day) => {
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
      expect(
        screen.getByTestId(`SchedulerPanel-${time}-title`),
      ).toBeInTheDocument();
    });

    // Check for specific course events
    await waitFor(() => {
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
    fireEvent.click(backButton);

    await waitFor(() => {
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
