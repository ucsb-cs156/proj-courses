import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

import PersonalSchedulesIndexPage from "main/pages/PersonalSchedules/PersonalSchedulesIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("PersonalSchedulesIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "PersonalSchedulesTable";

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

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

  test("renders without crashing for regular user", () => {
    setupUserOnly();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/personalschedules/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("renders without crashing for admin user", () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/personalschedules/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("renders three PersonalSchedules without crashing for regular user", async () => {
    setupUserOnly();
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/personalschedules/all")
      .reply(200, personalScheduleFixtures.threePersonalSchedules);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`),
    ).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "3",
    );
  });

  test("renders three PersonalSchedules without crashing for admin user", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/personalschedules/all")
      .reply(200, personalScheduleFixtures.threePersonalSchedules);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`),
    ).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "3",
    );
  });

  test("renders empty table when backend unavailable, user only", async () => {
    setupUserOnly();

    const queryClient = new QueryClient();
    axiosMock.onGet("/api/personalschedules/all").timeout();

    const restoreConsole = mockConsole();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/personalschedules/all",
    );
    restoreConsole();

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-id`),
    ).not.toBeInTheDocument();
  });

  // to be uncommented when Delete is implemented
  test("what happens when you click delete, admin", async () => {
    setupAdminUser();
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/personalschedules/all")
      .reply(200, personalScheduleFixtures.threePersonalSchedules);
    axiosMock
      .onDelete("/api/personalschedules")
      .reply(200, "PersonalSchedule with id 1 was deleted");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`),
    ).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "3",
    );

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToast).toBeCalledWith(
        "PersonalSchedule with id 1 was deleted",
      );
    });
  });
});
