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
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
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
    expect(await screen.findByTestId("UsersTable-cell-row-0-col-id")).toBeInTheDocument();

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

    expect(screen.queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
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

    // page 1 button should be present and active
    expect(await screen.findByRole("button", { name: "1" })).toBeInTheDocument();

    // click page 2 button
    screen.getByRole("button", { name: "2" }).click();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "2" })).toHaveStyle("font-weight: 500")
    );

    // click page 3 button
    screen.getByRole("button", { name: "3" }).click();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "3" })).toHaveStyle("font-weight: 500")
    );

    // click ‹ to go back to page 2
    screen.getByText("‹").click();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "2" })).toHaveStyle("font-weight: 500")
    );
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

    // on page 1: prev should be disabled, next should not
    expect(screen.getByText("‹")).toBeDisabled();
    expect(screen.getByText("›")).not.toBeDisabled();

    // jump to last page via button
    screen.getByRole("button", { name: "3" }).click();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "3" })).toHaveStyle("font-weight: 500")
    );

    // on last page: next should be disabled, prev should not
    expect(screen.getByText("›")).toBeDisabled();
    expect(screen.getByText("‹")).not.toBeDisabled();
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

    screen.getByRole("button", { name: "2" }).click();

    await waitFor(() => {
      expect(screen.getByText("user11@ucsb.edu")).toBeInTheDocument();
    });
  });

  test("numbered page button navigates directly to that page", async () => {
    const queryClient = new QueryClient();

    axiosMock.onGet("/api/admin/users", { params: { page: 0, pageSize: 10, sortDirection: "ASC" } })
      .reply(200, { content: usersFixtures.thirtyUsers.slice(0, 10), totalPages: 3 });
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

    // jump directly to page 3
    screen.getByRole("button", { name: "3" }).click();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "3" })).toHaveStyle("font-weight: 500")
    );
  });

  test("next button increments page", async () => {
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

    screen.getByText("›").click();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "2" })).toHaveStyle("font-weight: 500")
    );
  });

  test("shows ellipsis when there are gaps between page numbers", async () => {
    const queryClient = new QueryClient();

    axiosMock.onGet("/api/admin/users").reply(200, {
      content: usersFixtures.thirtyUsers.slice(0, 10),
      totalPages: 10,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Users")).toBeInTheDocument();

    // jump to middle page where ellipsis appears on both sides
    screen.getByRole("button", { name: "10" }).click();

    await waitFor(() => {
      expect(screen.getByText("…")).toBeInTheDocument();
    });
  });
});