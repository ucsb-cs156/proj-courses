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
      totalPages: 1,
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

    expect(screen.getByTestId(`UsersTable-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`UsersTable-cell-row-0-col-givenName`)).toHaveTextContent("Phill");
    expect(screen.getByTestId(`UsersTable-cell-row-0-col-familyName`)).toHaveTextContent("Conrad");
    expect(screen.getByTestId(`UsersTable-cell-row-0-col-email`)).toHaveTextContent("phtcon@ucsb.edu");
    expect(screen.getByTestId(`UsersTable-cell-row-0-col-admin`)).toHaveTextContent("true");
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
  });

  test("pagination buttons change pages correctly", async () => {
    const queryClient = new QueryClient();

    axiosMock.onGet("/api/admin/users", { params: { page: 0, pageSize: 10, sortDirection: "ASC" } })
      .reply(200, { content: usersFixtures.thirtyUsers.slice(0, 10), totalPages: 3 });
    axiosMock.onGet("/api/admin/users", { params: { page: 1, pageSize: 10, sortDirection: "ASC" } })
      .reply(200, { content: usersFixtures.thirtyUsers.slice(10, 20), totalPages: 3 });
    axiosMock.onGet("/api/admin/users", { params: { page: 2, pageSize: 10, sortDirection: "ASC" } })
      .reply(200, { content: usersFixtures.thirtyUsers.slice(20, 30), totalPages: 3 });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Users")).toBeInTheDocument();
    expect(await screen.findByText(/Page 1 \/ 3/)).toBeInTheDocument();

    screen.getByText("›").click();
    await waitFor(() => expect(screen.getByText(/Page 2 \/ 3/)).toBeInTheDocument());

    screen.getByText("›").click();
    await waitFor(() => expect(screen.getByText(/Page 3 \/ 3/)).toBeInTheDocument());

    screen.getByText("‹").click();
    await waitFor(() => expect(screen.getByText(/Page 2 \/ 3/)).toBeInTheDocument());
  });

  test("pagination buttons respect boundaries", async () => {
    const queryClient = new QueryClient();

    axiosMock.onGet("/api/admin/users").reply(200, {
      content: usersFixtures.thirtyUsers.slice(0, 10),
      totalPages: 3,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Users")).toBeInTheDocument();

    // first page, prev and first buttons disabled
    expect(screen.getByText("«")).toBeDisabled();
    expect(screen.getByText("‹")).toBeDisabled();
    expect(screen.getByText("›")).not.toBeDisabled();
    expect(screen.getByText("»")).not.toBeDisabled();

    // jump to last page
    screen.getByText("»").click();
    await waitFor(() => expect(screen.getByText(/Page 3 \/ 3/)).toBeInTheDocument());

    // last page: next and last buttons disabled
    expect(screen.getByText("›")).toBeDisabled();
    expect(screen.getByText("»")).toBeDisabled();
  });

  test("pagination shows different rows per page", async () => {
    const queryClient = new QueryClient();

    axiosMock.onGet("/api/admin/users", { params: { page: 0, pageSize: 10, sortDirection: "ASC" } })
      .reply(200, { content: usersFixtures.thirtyUsers.slice(0, 10), totalPages: 3 });
    axiosMock.onGet("/api/admin/users", { params: { page: 1, pageSize: 10, sortDirection: "ASC" } })
      .reply(200, { content: usersFixtures.thirtyUsers.slice(10, 20), totalPages: 3 });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Users")).toBeInTheDocument();
    expect(screen.getByText("user1@ucsb.edu")).toBeInTheDocument();

    screen.getByText("›").click();

    await waitFor(() => {
      expect(screen.getByText("user11@ucsb.edu")).toBeInTheDocument();
    });
  });
  
  test("first page button returns to page 1", async () => {
    const queryClient = new QueryClient();

    axiosMock.onGet("/api/admin/users", { params: { page: 0, pageSize: 10, sortDirection: "ASC" } })
      .reply(200, { content: usersFixtures.thirtyUsers.slice(0, 10), totalPages: 3 });
    axiosMock.onGet("/api/admin/users", { params: { page: 1, pageSize: 10, sortDirection: "ASC" } })
      .reply(200, { content: usersFixtures.thirtyUsers.slice(10, 20), totalPages: 3 });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Users")).toBeInTheDocument();

    // go to page 2
    screen.getByText("›").click();
    await waitFor(() => expect(screen.getByText(/Page 2 \/ 3/)).toBeInTheDocument());

    // jump back to first
    screen.getByText("«").click();
    await waitFor(() => expect(screen.getByText(/Page 1 \/ 3/)).toBeInTheDocument());
  });
});