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
import { fireEvent } from "@testing-library/react";

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
    expect(
      screen.queryByTestId(
        "PersonalSchedulesTable-cell-row-0-col-Delete-button",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("PersonalSchedulesTable-cell-row-0-col-Edit-button"),
    ).not.toBeInTheDocument();
  });

  test("renders 'Back' button", () => {
    const queryClient = new QueryClient();
    axiosMock.onGet(`/api/personalschedules?id=17`).reply(200, []);
    axiosMock.onGet(`api/personalSections/all?psId=17`).reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();

    // Optional: Test button functionality
    userEvent.click(backButton);
    // Add your assertions here to ensure that clicking the button triggers the expected action.
  });

  test("displays visual schedule blocks with correct data", async () => {
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
      const events = screen.getAllByTestId(/SchedulerEvent-/);
      expect(events.length).toBeGreaterThan(0);
    });

    // Check for specific visible time range text and titles (used in event logic)
    await waitFor(() => {
      const eventCards = screen.getAllByTestId(/SchedulerEvent-/);
      expect(eventCards.length).toBeGreaterThan(0);
    });

    // Specific title by test ID (best practice)
    expect(screen.getByTestId("SchedulerEventTitle-0-0-0")).toHaveTextContent(
      "COMP ENGR SEMINAR",
    );

    // OR: Fallback if test IDs aren’t added
    expect(screen.getAllByText("COMP ENGR SEMINAR").length).toBeGreaterThan(0);

    expect(screen.getByTestId("SchedulerEvent-0-0-0").firstChild).toHaveStyle(
      "padding: 5px",
    );
  });

  test("clicking on an event shows a popover with details", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    axiosMock
      .onGet("/api/personalschedules?id=17")
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);
    axiosMock
      .onGet("api/personalSections/all?psId=17")
      .reply(200, personalScheduleFixtures.threePersonalSchedulesDiffId);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const card = await screen.findByTestId("SchedulerEvent-0-0-0");
    fireEvent.click(card);
    const popover = screen.getByTestId("PopoverBody-0-0-0");

    await waitFor(() => {
      expect(popover).toHaveTextContent("15:00 - 15:50");
    });

    await waitFor(() => {
      expect(popover).toHaveTextContent("ECE 1A — BUCHN 1930");
    });
  });

  test("renders event title and time based on height thresholds", async () => {
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

    const titleEl = await screen.findByTestId("SchedulerEventTitle-0-0-0");
    expect(titleEl).toHaveTextContent("COMP ENGR SEMINAR");

    const timeEl = await screen.findByTestId("SchedulerEventTime-0-0-0");
    expect(timeEl).toHaveTextContent("15:00 - 15:50");
  });

  test("calendar grid has expected style", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    axiosMock.onGet("/api/personalschedules?id=17").reply(200, null);
    axiosMock.onGet("api/personalSections/all?psId=17").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const calendar = screen.getByTestId("calendar-grid");
    expect(calendar).toHaveStyle({
      position: "relative",
      height: "1000px",
      margin: "20px 0",
      border: "1px solid #ddd",
    });

    expect(calendar).toHaveStyle(`
      position: relative;
      height: 1000px;
      margin: 20px 0;
      border: 1px solid #ddd;
    `);
  });

  test("does NOT display time text when event height is less than 40", async () => {
    setupAdminUser();

    const queryClient = new QueryClient();
    axiosMock
      .onGet(`/api/personalschedules?id=17`)
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);

    axiosMock.onGet(`api/personalSections/all?psId=17`).reply(200, [
      {
        id: 2,
        courseId: "SHORT 102",
        title: "Short Event",
        enrolled: "5/10",
        location: "SHORT ROOM",
        classSections: [
          {
            enrollCode: "67890",
            section: "0200",
            timeLocations: [
              {
                days: "T",
                beginTime: "4:00 PM",
                endTime: "4:20 PM", // 20 minutes
                building: "SHORT",
                room: "102",
              },
            ],
          },
        ],
      },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId("SchedulerEvent-0-0-0");

    expect(screen.queryByText(/4:00 PM/)).not.toBeInTheDocument();
    expect(screen.queryByText(/4:20 PM/)).not.toBeInTheDocument();
  });

  test("displays time text when event height is exactly 40", async () => {
    setupAdminUser();

    const queryClient = new QueryClient();
    axiosMock
      .onGet(`/api/personalschedules?id=17`)
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);

    axiosMock.onGet(`api/personalSections/all?psId=17`).reply(200, [
      {
        id: 3,
        courseId: "BOUNDARY 103",
        title: "Boundary Case",
        enrolled: "8/15",
        location: "BOUNDARY ROOM",
        classSections: [
          {
            enrollCode: "24680",
            section: "0300",
            timeLocations: [
              {
                days: "W",
                beginTime: "10:00 AM",
                endTime: "10:40 AM", // 40 minutes, translates to height = 40
                building: "BOUNDARY",
                room: "103",
              },
            ],
          },
        ],
      },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/10:00 AM/)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/10:40 AM/)).toBeInTheDocument();
    });
  });

  test("correctly positions events based on time conversion", async () => {
    const queryClient = new QueryClient();
    axiosMock
      .onGet(`/api/personalschedules?id=17`)
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);
    axiosMock.onGet(`api/personalSections/all?psId=17`).reply(200, [
      {
        id: 1,
        courseId: "TEST 101",
        title: "Test Course",
        enrolled: "10/20",
        location: "TEST 101",
        classSections: [
          {
            enrollCode: "12345",
            section: "0100",
            timeLocations: [
              {
                days: "MWF",
                beginTime: "9:00 AM",
                endTime: "9:50 AM",
                building: "TEST",
                room: "101",
              },
            ],
          },
        ],
      },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const event = screen.getByTestId("SchedulerEvent-0-0-0");
      expect(event).toHaveStyle({ top: "634px" });
    });
    await waitFor(() => {
      const event = screen.getByTestId("SchedulerEvent-0-0-0");
      expect(event).toHaveStyle({ height: "50px" });
    });
    await waitFor(() => {
      const timeText = screen.getByText("9:00 AM - 9:50 AM");
      expect(timeText).toHaveStyle("font-size: 12px");
    });
    await waitFor(() => {
      const timeText = screen.getByText("9:00 AM - 9:50 AM");
      expect(timeText).toHaveStyle("text-align: left");
    });
  });

  test("does NOT display title when event height is less than 20", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    axiosMock
      .onGet("/api/personalschedules?id=17")
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);
    axiosMock.onGet("api/personalSections/all?psId=17").reply(200, [
      {
        id: 4,
        courseId: "HIDDEN 104",
        title: "Invisible Event",
        enrolled: "3/5",
        location: "STEALTH ROOM",
        quarter: "W24",
        classSections: [
          {
            enrollCode: "99999",
            section: "0400",
            timeLocations: [
              {
                days: "F",
                beginTime: "1:00 PM",
                endTime: "1:10 PM", // 10 min = height 10
                building: "HIDDEN",
                room: "104",
              },
            ],
          },
        ],
      },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Wait for event block to exist
    await screen.findByTestId("SchedulerEvent-0-0-0");

    // Confirm title is NOT rendered
    expect(
      screen.queryByTestId("SchedulerEventTitle-0-0-0"),
    ).not.toBeInTheDocument();
  });

  test("displays title text when event height is exactly 20", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    axiosMock
      .onGet("/api/personalschedules?id=17")
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);

    axiosMock.onGet("api/personalSections/all?psId=17").reply(200, [
      {
        id: 5,
        courseId: "EXACT 105",
        title: "Exact Match Event",
        enrolled: "1/5",
        location: "EXACT ROOM",
        quarter: "W24",
        classSections: [
          {
            enrollCode: "11111",
            section: "0500",
            timeLocations: [
              {
                days: "R",
                beginTime: "11:00 AM",
                endTime: "11:20 AM", // height = 20
                building: "EXACT",
                room: "105",
              },
            ],
          },
        ],
      },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Wait for title to appear
    const title = await screen.findByTestId("SchedulerEventTitle-0-0-0");
    expect(title).toHaveTextContent("Exact Match Event");
  });
});
