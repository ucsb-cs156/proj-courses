import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  const testId = "UsersTable";

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
    axiosMock.onGet("/api/admin/users").reply(200, {
      content: usersFixtures.threeUsers,
      totalPages: 2,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Users")).toBeInTheDocument();
    expect(
      await screen.findByTestId("UsersTable-cell-row-0-col-id"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId(`UsersTable-cell-row-0-col-id`),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId(`UsersTable-cell-row-0-col-givenName`),
    ).toHaveTextContent("Phill");
    expect(
      screen.getByTestId(`UsersTable-cell-row-0-col-familyName`),
    ).toHaveTextContent("Conrad");
    expect(
      screen.getByTestId(`UsersTable-cell-row-0-col-email`),
    ).toHaveTextContent("phtcon@ucsb.edu");
    expect(
      screen.getByTestId(`UsersTable-cell-row-0-col-admin`),
    ).toHaveTextContent("true");

    expect(screen.getByTestId("OurPagination-2")).toBeInTheDocument();

    const usersRequest = axiosMock.history.get.find(
      (request) => request.url === "/api/admin/users",
    );
    expect(usersRequest.params).toEqual({
      page: 0,
      pageSize: 10,
      sortDirection: "ASC",
    });
  });

  test("clicking pagination requests the second page", async () => {
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/admin/users").reply((config) => {
      if (config.params.page === 1) {
        return [
          200,
          {
            content: [usersFixtures.threeUsers[1]],
            totalPages: 2,
          },
        ];
      }

      return [
        200,
        {
          content: [usersFixtures.threeUsers[0]],
          totalPages: 2,
        },
      ];
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId("UsersTable-cell-row-0-col-email"),
    ).toHaveTextContent("phtcon@ucsb.edu");

    fireEvent.click(screen.getByTestId("OurPagination-2"));

    await waitFor(() => {
      expect(
        screen.getByTestId("UsersTable-cell-row-0-col-email"),
      ).toHaveTextContent("pconrad.cis@gmail.com");
    });

    const usersRequests = axiosMock.history.get.filter(
      (request) => request.url === "/api/admin/users",
    );
    expect(usersRequests).toHaveLength(2);
    expect(usersRequests[1].params).toEqual({
      page: 1,
      pageSize: 10,
      sortDirection: "ASC",
    });
  });

  test("renders empty table when backend unavailable", async () => {
    const queryClient = new QueryClient();
    axiosMock.onGet("/api/admin/users").timeout();

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
      "Error communicating with backend via GET on /api/admin/users",
    );
    restoreConsole();

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-id`),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("OurPagination-1")).not.toBeInTheDocument();
  });
});
