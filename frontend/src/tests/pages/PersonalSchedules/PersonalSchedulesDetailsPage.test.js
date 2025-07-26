import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import PersonalSchedulesDetailsPage from "main/pages/PersonalSchedules/PersonalSchedulesDetailsPage";
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

    // Add assertions to verify basic rendering
    expect(screen.getByText("Personal Schedules Details")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  test("handles API error gracefully", async () => {
    const queryClient = new QueryClient();
    axiosMock.onGet(`/api/personalschedules?id=17`).reply(500, {});

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

  test("renders 'Back' button and 'View Weekly Schedule' button", async () => {
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
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Check for Back button
    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();

    // Check for View Weekly Schedule button
    const weeklyViewButton = screen.getByRole("button", {
      name: /view weekly schedule/i,
    });
    expect(weeklyViewButton).toBeInTheDocument();
  });

  test("navigates to weekly view when 'View Weekly Schedule' button is clicked", async () => {
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
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const weeklyViewButton = screen.getByRole("button", {
      name: /view weekly schedule/i,
    });
    weeklyViewButton.click();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/personalschedules/weekly/17");
    });
  });

  test("navigates to list page when 'Back' button is clicked", async () => {
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
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const backButton = screen.getByRole("button", { name: /back/i });
    backButton.click();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/personalschedules/list");
    });
  });

  test("PersonalSchedulesTable should have showButtons set to false", async () => {
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
          <PersonalSchedulesDetailsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("PersonalSchedulesTable-cell-row-0-col-id"),
      ).toBeInTheDocument();
    });

    // Verify no edit/delete buttons are present
    expect(
      screen.queryByTestId(
        "PersonalSchedulesTable-cell-row-0-col-Delete-button",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("PersonalSchedulesTable-cell-row-0-col-Edit-button"),
    ).not.toBeInTheDocument();
  });
});
