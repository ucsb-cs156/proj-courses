import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SectionsTable from "main/components/Sections/SectionsTable";

import primaryFixtures from "fixtures/primaryFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";

// mock the error console to avoid cluttering the test output
import mockConsole from "jest-mock-console";

describe("SectionsTable.loggedOut tests", () => {

  let axiosMock;
  let restoreConsole;
  const queryClient = new QueryClient();

  const testId = "SectionsTable";

  beforeEach(() => {
    restoreConsole = mockConsole();
    axiosMock = new AxiosMockAdapter(axios);
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(403, {
        "timestamp": "2025-08-03T10:51:29.907-07:00",
        "status": 403,
        "error": "Forbidden",
        "path": "/api/currentUser"
      });
    axiosMock
      .onGet("/api/personalschedules/all")
      .reply(200, personalScheduleFixtures.threePersonalSchedules);
  });

  afterEach(() => {
    jest.clearAllMocks();
    axiosMock.restore();
    restoreConsole();
  });

  test("Has the expected cell values when expanded", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId(`${testId}-expand-all-rows`)).toBeInTheDocument();
    });
    const expandAll = screen.getByTestId(`${testId}-expand-all-rows`);
    fireEvent.click(expandAll);

    await waitFor(() => {
      expect(screen.getByTestId(`${testId}-row-0-not-logged-in`)).toBeInTheDocument();
    });

    const row0ExpandButton = screen.getByTestId(`${testId}-row-0-expand-button`);
    expect(row0ExpandButton).toBeInTheDocument();
    expect(row0ExpandButton).toHaveAttribute("style","cursor: pointer;");

  });

});