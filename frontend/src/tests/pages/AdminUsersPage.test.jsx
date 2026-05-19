import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import usersFixtures from "fixtures/usersFixtures";
import * as useBackend from "main/utils/useBackend";
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

  test("renders without crashing and fetches from correct endpoint", async () => {
    const queryClient = new QueryClient();
    const useBackendSpy = vi.spyOn(useBackend, "useBackend");
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

    expect(useBackendSpy).toHaveBeenCalledWith(["/api/admin/users", 0, 10], {
      method: "GET",
      url: "/api/admin/users",
      params: { page: 0, pageSize: 10, sortDirection: "ASC" },
    });

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThan(0);

      expect(axiosMock.history.get.some((req) => req.url === "")).toBe(false);
    });

    useBackendSpy.mockRestore();
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

  test("pagination navigates pages correctly and shows different rows per page", async () => {
    const queryClient = new QueryClient();

    axiosMock
      .onGet("/api/admin/users", {
        params: { page: 0, pageSize: 10, sortDirection: "ASC" },
      })
      .reply(200, {
        content: usersFixtures.thirtyUsers.slice(0, 10),
        totalPages: 3,
      });
    axiosMock
      .onGet("/api/admin/users", {
        params: { page: 1, pageSize: 10, sortDirection: "ASC" },
      })
      .reply(200, {
        content: usersFixtures.thirtyUsers.slice(10, 20),
        totalPages: 3,
      });
    axiosMock
      .onGet("/api/admin/users", {
        params: { page: 2, pageSize: 10, sortDirection: "ASC" },
      })
      .reply(200, {
        content: usersFixtures.thirtyUsers.slice(20, 30),
        totalPages: 3,
      });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.queryByText("…")).not.toBeInTheDocument();
    expect(await screen.findByText("Users")).toBeInTheDocument();
    expect(screen.getByText("user1@ucsb.edu")).toBeInTheDocument();

    // page 1 active, prev disabled, next enabled
    expect(
      await screen.findByRole("button", { name: "1" }),
    ).toBeInTheDocument();
    expect(screen.getByText("‹")).toBeDisabled();
    expect(screen.getByText("›")).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "1" })).toHaveStyle(
      "font-weight: 500",
    );
    expect(screen.getByRole("button", { name: "2" })).toHaveStyle(
      "font-weight: 400",
    );

    // click page 2 via numbered button
    screen.getByRole("button", { name: "2" }).click();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "2" })).toHaveStyle(
        "font-weight: 500",
      );
      expect(screen.getByRole("button", { name: "1" })).toHaveStyle(
        "font-weight: 400",
      );
      expect(screen.getByText("user11@ucsb.edu")).toBeInTheDocument();
    });

    // click page 3 via numbered button
    screen.getByRole("button", { name: "3" }).click();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "3" })).toHaveStyle(
        "font-weight: 500",
      ),
    );

    // last page: next disabled, prev enabled
    expect(screen.getByText("›")).toBeDisabled();
    expect(screen.getByText("‹")).not.toBeDisabled();

    // click prev to go back to page 2
    screen.getByText("‹").click();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "2" })).toHaveStyle(
        "font-weight: 500",
      ),
    );

    // click next back to page 3
    screen.getByText("›").click();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "3" })).toHaveStyle(
        "font-weight: 500",
      ),
    );
  });

  test("page buttons are sorted and ellipsis appears for gaps", async () => {
    const queryClient = new QueryClient();

    axiosMock.onGet("/api/admin/users").reply(200, {
      content: usersFixtures.threeUsers,
      totalPages: 10,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Users")).toBeInTheDocument();

    // buttons should be in ascending order
    const buttons = screen.getAllByRole("button", { name: /^[0-9]+$/ });
    const pageNums = buttons.map((b) => parseInt(b.textContent));
    expect(pageNums).toEqual([...pageNums].sort((a, b) => a - b));

    buttons.forEach((btn) => {
      const num = Number(btn.textContent);
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(10);
    });

    expect(
      screen.queryByRole("button", { name: "11" }),
    ).not.toBeInTheDocument();

    // pages 4-9 not visible on page 1
    expect(screen.queryByRole("button", { name: "4" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "9" })).not.toBeInTheDocument();

    // jump to page 10 — ellipsis appears, pages 2-7 hidden, 8-10 visible
    screen.getByRole("button", { name: "10" }).click();

    await waitFor(() => {
      expect(screen.getByText("…")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "2" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "7" }),
      ).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "8" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "9" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "11" }),
      ).not.toBeInTheDocument();

      expect(screen.getByText("‹")).toHaveStyle("font-weight: 400");
      expect(screen.getByText("›")).toHaveStyle("font-weight: 400");
    });
  });

  test("shows correct nearby pages around current page", async () => {
    const queryClient = new QueryClient();

    axiosMock.onGet("/api/admin/users").reply(200, {
      content: usersFixtures.threeUsers,
      totalPages: 10,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Users")).toBeInTheDocument();

    screen.getByRole("button", { name: "3" }).click();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "6" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "7" }),
      ).not.toBeInTheDocument();
    });
  });
});
