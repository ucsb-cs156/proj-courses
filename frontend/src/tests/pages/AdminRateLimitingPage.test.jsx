import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { vi } from "vitest";

import * as useBackend from "main/utils/useBackend";
import AdminRateLimitingPage from "main/pages/Admin/AdminRateLimitingPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import rateLimitedIPFixtures from "fixtures/rateLimitedIPFixtures";

describe("AdminRateLimitingPage tests", () => {
  const queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/admin/rate-limited-ips")
      .reply(200, rateLimitedIPFixtures.threeIPsPage);
  });

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminRateLimitingPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(await screen.findByText("Rate Limiting")).toBeInTheDocument();

    const testId = "RateLimitedIPsTable";
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-ipAddress`),
    ).toHaveTextContent("192.168.1.1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requestCount`),
    ).toHaveTextContent("5");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-ipAddress`),
    ).toHaveTextContent("10.0.0.1");
  });

  test("When localstorage is empty, fallback values are used", async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminRateLimitingPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Rate Limiting");
    expect(setItemSpy).toHaveBeenCalledWith(
      "RateLimitedIPsSearch.PageSize",
      "10",
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      "RateLimitedIPsSearch.SortField",
      "requestCount",
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      "RateLimitedIPsSearch.SortDirection",
      "DESC",
    );

    const paginatedRequest = axiosMock.history.get.find(
      (req) => req.url === "/api/admin/rate-limited-ips",
    );
    expect(paginatedRequest.params).toEqual({
      page: 0,
      pageSize: "10",
      sortField: "requestCount",
      sortDirection: "DESC",
    });
  });

  test("When localstorage has values, they are used", async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation((key) => {
      const responses = {
        "RateLimitedIPsSearch.PageSize": "50",
        "RateLimitedIPsSearch.SortField": "lastRequestAt",
        "RateLimitedIPsSearch.SortDirection": "ASC",
      };
      return responses[key] || null;
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminRateLimitingPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Rate Limiting");
    const paginatedRequest = axiosMock.history.get.find(
      (req) => req.url === "/api/admin/rate-limited-ips",
    );
    expect(paginatedRequest.params).toEqual({
      page: 0,
      pageSize: "50",
      sortField: "lastRequestAt",
      sortDirection: "ASC",
    });
  });

  test("useBackend is called with correct arguments", async () => {
    const useBackendSpy = vi.spyOn(useBackend, "useBackend");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminRateLimitingPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Rate Limiting");
    const validPageSizeRegex = /^[1-9]\d*$/;
    const validSortFieldRegex = /^(?:requestCount|lastRequestAt)$/;
    const validSortDirectionRegex = /^(?:ASC|DESC)$/;
    expect(useBackendSpy).toHaveBeenCalledWith(
      ["/api/admin/rate-limited-ips"],
      {
        method: "GET",
        url: "/api/admin/rate-limited-ips",
        params: {
          page: expect.any(Number),
          pageSize: expect.stringMatching(validPageSizeRegex),
          sortField: expect.stringMatching(validSortFieldRegex),
          sortDirection: expect.stringMatching(validSortDirectionRegex),
        },
      },
      { content: [], totalPages: 0 },
    );

    useBackendSpy.mockRestore();
  });
});
