import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import PersonalSchedulesDetailsPage from "main/pages/PersonalSchedules/PersonalSchedulesDetailsPage";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import userEvent from "@testing-library/user-event";

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

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("PersonalSchedulesDetailsPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "PersonalSchedulesTable";

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
          <PersonalSchedulesDetailsPage />
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
      .onGet(`api/personalSections/all?psId=17`)
      .reply(200, personalScheduleFixtures.threePersonalSchedulesDiffId);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(
        screen.getByText("Personal Schedules Details"),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText("Sections in Personal Schedule"),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByTestId("PersonalSchedulesTable-cell-row-0-col-id"),
      ).toHaveTextContent("17");
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("PersonalSectionsTable-cell-row-0-col-courseId"),
      ).toHaveTextContent("ECE 1A");
    });

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-description`),
    ).toHaveTextContent("My Winter Courses");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-name`),
    ).toHaveTextContent("CS156");
    expect(
      screen.getByTestId(
        `PersonalSectionsTable-cell-row-0-col-classSections[0].enrollCode`,
      ),
    ).toHaveTextContent("12583");
    expect(
      screen.getByTestId(
        `PersonalSectionsTable-cell-row-0-col-classSections[0].section`,
      ),
    ).toHaveTextContent("0100");
    expect(
      screen.getByTestId(`PersonalSectionsTable-cell-row-0-col-title`),
    ).toHaveTextContent("COMP ENGR SEMINAR");
    expect(
      screen.getByTestId(`PersonalSectionsTable-cell-row-0-col-enrolled`),
    ).toHaveTextContent("84/100");
    expect(
      screen.getByTestId(`PersonalSectionsTable-cell-row-0-col-location`),
    ).toHaveTextContent("BUCHN 1930");
    expect(
      screen.getByTestId(
        `PersonalSectionsTable-cell-row-0-col-classSections[0].timeLocations[0].days`,
      ),
    ).toHaveTextContent("M");
    expect(
      screen.getByTestId(`PersonalSectionsTable-cell-row-0-col-time`),
    ).toHaveTextContent("3:00 PM - 3:50 PM");
    expect(
      screen.getByTestId(`PersonalSectionsTable-cell-row-0-col-instructor`),
    ).toHaveTextContent("WANG L C");

    const deleteButton = screen.getByTestId(
      `PersonalSectionsTable-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("renders 'Back' button", async () => {
    const queryClient = new QueryClient();
    axiosMock
      .onGet(`/api/personalschedules?id=17`)
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);
    axiosMock
      .onGet(`api/personalSections/all?psId=17`)
      .reply(200, personalScheduleFixtures.threePersonalSchedulesDiffId);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Check for Back button
    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();
  });

  test("renders PersonalSchedulerPanel with events", async () => {
    setupAdminUser(); // or setupUser() if non-admin is sufficient
    const queryClient = new QueryClient();
    const scheduleId = 17;

    // Use a fixture for sections that will produce some events
    // We can reuse personalScheduleFixtures.threePersonalSchedulesDiffId if it's suitable
    // or define a more specific one if needed for clarity.
    // For this example, let's assume onePersonalScheduleDiffId and threePersonalSchedulesDiffId are good enough.
    axiosMock
      .onGet(`/api/personalschedules?id=${scheduleId}`)
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);
    axiosMock
      .onGet(`/api/personalSections/all?psId=${scheduleId}`)
      .reply(200, personalScheduleFixtures.threePersonalSchedulesDiffId); // This should contain sections data

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Weekly Schedule View")).toBeInTheDocument();
    });

    // Check for day titles rendered by PersonalSchedulerPanel
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      // "Saturday", // Uncomment if your fixture/data includes these
      // "Sunday",
    ];
    days.forEach((day) => {
      expect(
        screen.getByTestId(`SchedulerPanel-${day}-title`),
      ).toBeInTheDocument();
    });

    // Check for some time slot identifiers
    // Note: The testid in PersonalSchedulePanel is `SchedulerPanel-${hour.replace(" ", "-")}-title`
    // And for the label inside it is `SchedulerPanel-${hour.replace(" ", "-")}-label`
    expect(screen.getByTestId("SchedulerPanel-8-AM-title")).toBeInTheDocument();
    expect(
      screen.getByTestId("SchedulerPanel-12-PM-title"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("SchedulerPanel-3-PM-title")).toBeInTheDocument();

    // You might also want to check if specific events derived from your fixtures are rendered.
    // This would involve looking for elements with testids like `SchedulerEvent-${event.id}`
    // For example, if one of the events from threePersonalSchedulesDiffId is expected:
    await waitFor(() => {
      // The event ID is constructed as `${classSection.enrollCode}-${day}`
      // courseId: "ECE 1A ", section: "0100", enrollCode: "12583", days: "M  "
      // title becomes: "ECE 1A (0100)"
      // id becomes: "12583-Monday"
      expect(
        screen.getByTestId("SchedulerEvent-12583-Monday"),
      ).toBeInTheDocument();
    });
  });
});
