import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import usersFixtures from "fixtures/usersFixtures";
import AdminUsersPage from "main/pages/Admin/AdminUsersPage";

describe("AdminUsersPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const testId = "UsersPaginated";

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing on three users", async () => {
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/admin/users/paginated")
      .reply(200, usersFixtures.threeUsersPage);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Users")).toBeInTheDocument();
    expect(
      await screen.findByTestId("UsersPaginated-cell-row-0-col-id"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId(`UsersPaginated-cell-row-0-col-id`),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId(`UsersPaginated-cell-row-0-col-givenName`),
    ).toHaveTextContent("Phill");
    expect(
      screen.getByTestId(`UsersPaginated-cell-row-0-col-familyName`),
    ).toHaveTextContent("Conrad");
    expect(
      screen.getByTestId(`UsersPaginated-cell-row-0-col-email`),
    ).toHaveTextContent("phtcon@ucsb.edu");
    expect(
      screen.getByTestId(`UsersPaginated-cell-row-0-col-admin`),
    ).toHaveTextContent("true");

    // Verify API was called with correct pagination parameters
    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });
    const getCall = axiosMock.history.get.find((request) =>
      request.url.includes("/api/admin/users/paginated"),
    );
    expect(getCall).toBeDefined();
    expect(getCall.params.page).toBe(0); // page 0-indexed (selectedPage - 1)
    expect(getCall.params.sortDirection).toBe("ASC");
  });

  test("renders empty table when backend unavailable", async () => {
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/admin/users/paginated").timeout();

    const restoreConsole = mockConsole();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/admin/users/paginated",
    );
    restoreConsole();

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-id`),
    ).not.toBeInTheDocument();
  });

  test("passes correct pagination parameters to API", async () => {
    const queryClient = new QueryClient();
    axiosMock
      .onGet("/api/admin/users/paginated")
      .reply(200, usersFixtures.threeUsersPage);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    // Verify the API call includes correct sort direction "ASC"
    const getCall = axiosMock.history.get.find((request) =>
      request.url.includes("/api/admin/users/paginated"),
    );
    expect(getCall.params.sortDirection).toBe("ASC");
    expect(getCall.params.sortField).toBe("id");
    // Verify page is 0-indexed (selectedPage - 1, where selectedPage defaults to 1)
    expect(getCall.params.page).toBe(0);
  });
});
