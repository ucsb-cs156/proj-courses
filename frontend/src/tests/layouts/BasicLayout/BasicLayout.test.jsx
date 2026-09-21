import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { healthFixtures } from "fixtures/healthFixtures";

describe("BasicLayout tests", () => {
  let axiosMock;
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
  });

  afterEach(() => {
    queryClient.clear();
    axiosMock.restore();
  });

  const renderLayout = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicLayout>
            <p>Page content</p>
          </BasicLayout>
        </MemoryRouter>
      </QueryClientProvider>,
    );

  test("shows no banner when the databases are up", async () => {
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock.onGet("/api/actuator/health").reply(200, healthFixtures.allUp);

    renderLayout();

    expect(screen.getByText("Page content")).toBeInTheDocument();
    await waitFor(() =>
      expect(axiosMock.history.get.map((request) => request.url)).toContain(
        "/api/actuator/health",
      ),
    );
    expect(
      screen.queryByTestId("AppNavbar-systemMessage-0"),
    ).not.toBeInTheDocument();
  });

  test("shows no banner when the health check itself fails", async () => {
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock.onGet("/api/actuator/health").networkError();

    renderLayout();

    await waitFor(() =>
      expect(axiosMock.history.get.map((request) => request.url)).toContain(
        "/api/actuator/health",
      ),
    );
    expect(
      screen.queryByTestId("AppNavbar-systemMessage-0"),
    ).not.toBeInTheDocument();
  });

  test("shows a banner when MongoDB is down", async () => {
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/actuator/health")
      .reply(503, healthFixtures.mongoDown);

    renderLayout();

    const banner = await screen.findByTestId("AppNavbar-systemMessage-0");
    expect(banner).toHaveTextContent(
      "The course database (MongoDB) is currently unavailable",
    );
    expect(banner).toHaveClass("alert-danger");
    expect(
      screen.queryByTestId("AppNavbar-systemMessage-1"),
    ).not.toBeInTheDocument();
  });

  test("shows outage banners ahead of the messages from systemInfo", async () => {
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.withSystemMessages);
    axiosMock.onGet("/api/actuator/health").reply(503, healthFixtures.bothDown);

    renderLayout();

    await waitFor(() =>
      expect(screen.getByTestId("AppNavbar-systemMessage-0")).toHaveTextContent(
        "The course database (MongoDB) is currently unavailable",
      ),
    );
    expect(screen.getByTestId("AppNavbar-systemMessage-1")).toHaveTextContent(
      "The user database (SQL) is currently unavailable",
    );
    await waitFor(() =>
      expect(screen.getByTestId("AppNavbar-systemMessage-2")).toHaveTextContent(
        "This is a danger message",
      ),
    );
    expect(screen.getByTestId("AppNavbar-systemMessage-3")).toHaveTextContent(
      "This is a warning message",
    );
  });
});
