import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import PersonalSchedulesWeeklyViewPage from "main/pages/PersonalSchedules/PersonalSchedulesWeeklyViewPage";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
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
  });

  test("shows the correct info for admin users", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock
      .onGet(`/api/personalschedules?id=17`)
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);
    axiosMock
      .onGet(`/api/personalSections/all?psId=17`)
      .reply(200, personalScheduleFixtures.threePersonalSchedulesDiffId);

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
      expect(screen.getByText("CS156")).toBeInTheDocument();
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
      .reply(200, personalScheduleFixtures.threePersonalSchedulesDiffId);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesWeeklyViewPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const backButton = screen.getByRole("button", { name: /back to details/i });
    backButton.click();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/personalschedules/details/17",
      );
    });
  });
});
