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

  test("renders calendar with correct background style", async () => {
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

    const grid = await screen.findByTestId("calendar-grid");
    expect(grid).toHaveStyle(
      "background: repeating-linear-gradient(#f9f9f9 0px, #f9f9f9 60px, #eee 60px, #eee 61px)",
    );
  });

  test("displays time text only when event height is at least 40", async () => {
    setupAdminUser();

    const queryClient = new QueryClient();
    axiosMock
      .onGet(`/api/personalschedules?id=17`)
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);

    // Use section with height >= 40
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
                days: "M",
                beginTime: "1:00 PM",
                endTime: "2:00 PM",
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
      // Depending on how time is rendered (as full text or split), this may need to be adjusted
      expect(screen.getByText(/1:00 PM/)).toBeInTheDocument();
      expect(screen.getByText(/2:00 PM/)).toBeInTheDocument();
    });
  });

  test("does NOT display time text when event height is less than 40", async () => {
    setupAdminUser();

    const queryClient = new QueryClient();
    axiosMock
      .onGet(`/api/personalschedules?id=17`)
      .reply(200, personalScheduleFixtures.onePersonalScheduleDiffId);

    // Provide a section with short duration (20 minutes)
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
                endTime: "4:20 PM", // 20 minutes = height < 40px
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

    // Wait for event to render
    await waitFor(() => {
      expect(screen.getByTestId("SchedulerEvent-0-0-0")).toBeInTheDocument();
    });

    // Assert time text is NOT shown
    expect(screen.queryByText(/4:00 PM/)).not.toBeInTheDocument();
    expect(screen.queryByText(/4:20 PM/)).not.toBeInTheDocument();
    expect(screen.queryByText(/4:00 PM - 4:20 PM/)).not.toBeInTheDocument();
  });



  test("calendar grid has expected styles", async () => {
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
      </QueryClientProvider>
    );

    const calendarGrid = await screen.findByTestId("calendar-grid");

    expect(calendarGrid).toHaveStyle("position: relative");
    expect(calendarGrid).toHaveStyle("height: 1000px");
    expect(calendarGrid).toHaveStyle("margin: 20px 0");
    expect(calendarGrid).toHaveStyle("border: 1px solid #ddd");
    expect(calendarGrid).toHaveStyle(
      "background: repeating-linear-gradient(#f9f9f9 0px, #f9f9f9 60px, #eee 60px, #eee 61px)"
    );
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

  describe("convertTimeToMinutes and event styles", () => {
    beforeEach(() => {
      setupAdminUser();
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
        // 9:00 AM should convert to 540 minutes (9 * 60)
        // The component adds 94px to the top position
        expect(event).toHaveStyle({ top: "634px" }); // 540 + 94 = 634
        // Duration from 9:00 AM to 9:50 AM is 50 minutes
        expect(event).toHaveStyle({ height: "50px" });
      });
    });

    test("creates correct event styles from personal sections", async () => {
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
        expect(screen.getByTestId("SchedulerEvent-0-0-0")).toBeInTheDocument();
        const event = screen.getByTestId("SchedulerEvent-0-0-0");
        expect(event).toHaveStyle({
          backgroundColor: "#b3d9ff",
          border: "2px solid #3399ff",
        });
        expect(event).toHaveTextContent("COMP ENGR SEMINAR");
      });
    });
  });
});
