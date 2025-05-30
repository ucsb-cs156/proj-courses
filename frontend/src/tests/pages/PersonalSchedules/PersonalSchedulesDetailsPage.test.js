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

  const hours = [
    "",
    "6 AM",
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  const renderPage = ({
    sections = [],
    schedules = personalScheduleFixtures.onePersonalScheduleDiffId,
  } = {}) => {
    const queryClient = new QueryClient();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock.onGet("/api/personalschedules/all").reply(200, schedules);
    axiosMock.onGet(`/api/personalschedules?id=17`).reply(200, schedules);
    axiosMock.onGet(`api/personalSections/all?psId=17`).reply(200, sections);
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  test("renders without crashing for regular user", () => {
    renderPage();
  });

  test("shows the correct info for admin users", async () => {
    setupAdminUser();
    renderPage({
      schedules: personalScheduleFixtures.onePersonalScheduleDiffId,
      sections: personalScheduleFixtures.threePersonalSchedulesDiffId,
    });
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

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-description`),
      ).toHaveTextContent("My Winter Courses");
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-name`),
      ).toHaveTextContent("CS156");
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "PersonalSectionsTable-cell-row-0-col-classSections[0].enrollCode",
        ),
      ).toHaveTextContent("12583");
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "PersonalSectionsTable-cell-row-0-col-classSections[0].section",
        ),
      ).toHaveTextContent("0100");
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("PersonalSectionsTable-cell-row-0-col-title"),
      ).toHaveTextContent("COMP ENGR SEMINAR");
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("PersonalSectionsTable-cell-row-0-col-enrolled"),
      ).toHaveTextContent("84/100");
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("PersonalSectionsTable-cell-row-0-col-location"),
      ).toHaveTextContent("BUCHN 1930");
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(
          "PersonalSectionsTable-cell-row-0-col-classSections[0].timeLocations[0].days",
        ),
      ).toHaveTextContent("M");
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("PersonalSectionsTable-cell-row-0-col-time"),
      ).toHaveTextContent("3:00 PM - 3:50 PM");
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("PersonalSectionsTable-cell-row-0-col-instructor"),
      ).toHaveTextContent("WANG L C");
    });

    await waitFor(() => {
      const deleteButton = screen.getByTestId(
        "PersonalSectionsTable-cell-row-0-col-Delete-button",
      );
      expect(deleteButton).toBeInTheDocument();
    });

    await waitFor(() => {
      const deleteButton = screen.getByTestId(
        "PersonalSectionsTable-cell-row-0-col-Delete-button",
      );
      expect(deleteButton).toHaveClass("btn-danger");
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId(
          "PersonalSchedulesTable-cell-row-0-col-Delete-button",
        ),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId(
          "PersonalSchedulesTable-cell-row-0-col-Edit-button",
        ),
      ).not.toBeInTheDocument();
    });
  });

  test("renders 'Back' button and tests its functionality", () => {
    renderPage();
    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();
    userEvent.click(backButton);
  });

  test("displays visual schedule blocks with correct data", async () => {
    setupAdminUser();
    renderPage({
      schedules: personalScheduleFixtures.onePersonalScheduleDiffId,
      sections: personalScheduleFixtures.threePersonalSchedulesDiffId,
    });
    await waitFor(() => {
      const events = screen.getAllByTestId(/SchedulerEvent-/);
      expect(events.length).toBeGreaterThan(0);
    });
    expect(screen.getByTestId("SchedulerEventTitle-0-0-0-M")).toHaveTextContent(
      "COMP ENGR SEMINAR",
    );
    expect(screen.getByTestId("SchedulerEvent-0-0-0-M").firstChild).toHaveStyle(
      "padding: 5px",
    );
  });

  test("clicking on an event shows a popover with details", async () => {
    setupAdminUser();
    renderPage({
      schedules: personalScheduleFixtures.onePersonalScheduleDiffId,
      sections: personalScheduleFixtures.threePersonalSchedulesDiffId,
    });
    const card = await screen.findByTestId("SchedulerEvent-0-0-0-M");
    fireEvent.click(card);
    const popover = screen.getByTestId("PopoverBody-0-0-0-M");
    await waitFor(() => {
      expect(popover).toHaveTextContent("15:00 - 15:50");
    });
    await waitFor(() => {
      expect(popover).toHaveTextContent("ECE 1A — BUCHN 1930");
    });
  });

  test("renders event title and time based on height thresholds", async () => {
    setupAdminUser();
    renderPage({
      schedules: personalScheduleFixtures.onePersonalScheduleDiffId,
      sections: personalScheduleFixtures.threePersonalSchedulesDiffId,
    });
    const titleEl = await screen.findByTestId("SchedulerEventTitle-0-0-0-M");
    expect(titleEl).toHaveTextContent("COMP ENGR SEMINAR");
    const timeEl = await screen.findByTestId("SchedulerEventTime-0-0-0-M");
    expect(timeEl).toHaveTextContent("15:00 - 15:50");
  });

  test("calendar grid has expected style", async () => {
    setupAdminUser();
    axiosMock.onGet("/api/personalschedules?id=17").reply(200, null);
    axiosMock.onGet("api/personalSections/all?psId=17").reply(200, []);
    renderPage();
    const calendar = screen.getByTestId("calendar-grid");
    expect(calendar).toHaveStyle({
      position: "relative",
      height: "1500px",
      margin: "20px 0",
      border: "1px solid #ddd",
    });
    expect(calendar).toHaveStyle(`
      position: relative;
      height: 1500px;
      margin: 20px 0;
      border: 1px solid #ddd;
    `);
  });

  test("displays time text when event height is exactly 40", async () => {
    setupAdminUser();
    renderPage({
      sections: [
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
                  endTime: "10:40 AM",
                  building: "BOUNDARY",
                  room: "103",
                },
              ],
            },
          ],
        },
      ],
    });
    await waitFor(() => {
      expect(screen.getByText(/10:00 AM/)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/10:40 AM/)).toBeInTheDocument();
    });
  });

  test("displays title text when event height is exactly 20", async () => {
    setupAdminUser();
    renderPage({
      sections: [
        {
          id: 5,
          courseId: "EXACT 105",
          title: "Exact Match Event",
          enrolled: "1/5",
          location: "EXACT ROOM",
          classSections: [
            {
              enrollCode: "11111",
              section: "0500",
              timeLocations: [
                {
                  days: "R",
                  beginTime: "11:00 AM",
                  endTime: "11:20 AM",
                  building: "EXACT",
                  room: "105",
                },
              ],
            },
          ],
        },
      ],
    });
    const title = await screen.findByTestId("SchedulerEventTitle-0-0-0-R");
    expect(title).toHaveTextContent("Exact Match Event");
  });

  test("renders weekly calendar with all days and hours", async () => {
    setupAdminUser();
    renderPage();

    daysOfWeek.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });

    hours.filter(Boolean).forEach((hour) => {
      expect(screen.getAllByText(hour)[0]).toBeInTheDocument();
    });
  });

  test("each day column renders a top spacer div with height 30px", async () => {
    setupAdminUser();
    renderPage();
    await screen.findByTestId("calendar-grid");

    const divsWithHeight30px = Array.from(
      document.querySelectorAll("div"),
    ).filter((div) => div.style.height === "30px");
    expect(divsWithHeight30px.length).toBe(8);
  });

  test("renders correct number of empty time slots and time slots per day", async () => {
    setupAdminUser();
    renderPage();
    const calendar = await screen.findByTestId("calendar-grid");
    expect(calendar).toBeInTheDocument();

    const expectedSlotsPerDay = hours.length - 1;
    const expectedTotalSlots = 7 * expectedSlotsPerDay;

    const allSlots = screen
      .getAllByRole("generic")
      .filter((el) => el.style?.height === "60px");
    expect(allSlots.length).toBeGreaterThanOrEqual(expectedTotalSlots);

    const cards = screen
      .getAllByRole("generic")
      .filter(
        (el) => el.className.includes("card") && el.style?.height === "100%",
      );
    expect(cards.length).toBe(expectedTotalSlots);
  });

  test("time label column renders correct number of rows with height and no border", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    axiosMock
      .onGet("/api/personalschedules?id=17")
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);

    axiosMock.onGet("api/personalSections/all?psId=17").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("calendar-grid")).toBeInTheDocument();
    });

    const hours = [
      "",
      "6 AM",
      "7 AM",
      "8 AM",
      "9 AM",
      "10 AM",
      "11 AM",
      "12 PM",
      "1 PM",
      "2 PM",
      "3 PM",
      "4 PM",
      "5 PM",
      "6 PM",
      "7 PM",
      "8 PM",
      "9 PM",
      "10 PM",
    ];

    const sixAmLabel = screen.getAllByText("6 AM")[0];
    expect(sixAmLabel).toBeInTheDocument();

    const timeColumn = sixAmLabel.closest("div")?.parentElement;
    expect(timeColumn).toBeTruthy();

    const timeSlotRows = Array.from(timeColumn.querySelectorAll("div")).filter(
      (div) => div.style?.height === "60px" && div.querySelector("span"),
    );

    expect(timeSlotRows.length).toBe(hours.length);
  });

  test("time label column has top spacer and hour rows with correct border and height styles", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    axiosMock
      .onGet("/api/personalschedules?id=17")
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);

    axiosMock.onGet("api/personalSections/all?psId=17").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("calendar-grid")).toBeInTheDocument();
    });

    const hours = [
      "",
      "6 AM",
      "7 AM",
      "8 AM",
      "9 AM",
      "10 AM",
      "11 AM",
      "12 PM",
      "1 PM",
      "2 PM",
      "3 PM",
      "4 PM",
      "5 PM",
      "6 PM",
      "7 PM",
      "8 PM",
      "9 PM",
      "10 PM",
    ];

    const sixAmLabel = screen.getAllByText("6 AM")[0];
    expect(sixAmLabel).toBeInTheDocument();

    const timeColumn = sixAmLabel.closest("div")?.parentElement;
    expect(timeColumn).toBeTruthy();

    const rows = Array.from(timeColumn.children);

    const topSpacer = rows[0];
    expect(topSpacer).toBeTruthy();
    expect(topSpacer.style.height).toBe("30px");
    expect(topSpacer.style.border).toMatch(/^0(px)?$/);

    const hourRows = rows.slice(1);
    expect(hourRows.length).toBe(hours.length);

    hourRows.forEach((row) => {
      expect(row.style.border).toMatch(/^0(px)?$/);
      expect(row.style.height).toBe("60px");
    });
  });

  test("event time element has correct fontSize and textAlign styles", async () => {
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

    const timeElement = await screen.findByTestId("SchedulerEventTime-0-0-0-M");

    expect(timeElement).toBeInTheDocument();
    expect(timeElement.style.fontSize).toBe("12px");
    expect(timeElement.style.textAlign).toBe("center");
  });

  test('calendar does not render "Stryker was here!" as top-left hour label', async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    axiosMock
      .onGet("/api/personalschedules?id=17")
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);

    axiosMock.onGet("api/personalSections/all?psId=17").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("calendar-grid")).toBeInTheDocument();
    });

    const strykerText = screen.queryByText("Stryker was here!");
    expect(strykerText).not.toBeInTheDocument();
  });

  test("does NOT render event time if event height is less than 40", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();

    axiosMock
      .onGet("/api/personalschedules?id=17")
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);

    axiosMock.onGet("api/personalSections/all?psId=17").reply(200, [
      {
        id: 9,
        courseId: "TINY 999",
        title: "Tiny Event",
        enrolled: "1/5",
        location: "NOWHERE",
        quarter: "W24",
        classSections: [
          {
            enrollCode: "99999",
            section: "0999",
            timeLocations: [
              {
                days: "F",
                beginTime: "11:00 AM",
                endTime: "11:20 AM",
                building: "GIRARD",
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

    const eventCard = await screen.findByTestId("SchedulerEvent-0-0-0-F");
    expect(eventCard).toBeInTheDocument();

    const timeEl = screen.queryByTestId("SchedulerEventTime-0-0-0-F");
    expect(timeEl).not.toBeInTheDocument();
  });
});
