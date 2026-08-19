import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import DeveloperPage from "main/pages/DeveloperPage";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";

describe("DeveloperPage tests", () => {
  let queryClient;
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    queryClient = new QueryClient();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DeveloperPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(
      await screen.findByText("Developer Information"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Current Deployed Branch"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Backend Endpoints")).toBeInTheDocument();
    expect(await screen.findByText("System Info")).toBeInTheDocument();
    expect(await screen.findByText("mocklink")).toBeInTheDocument();
    expect(await screen.findByText("abc123")).toBeInTheDocument();
    expect(
      await screen.findByText("This is a mock commit message"),
    ).toBeInTheDocument();

    // showingNeither fixture disables both links
    expect(
      screen.queryByTestId("developer-swagger-link"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("developer-h2-console-link"),
    ).not.toBeInTheDocument();
  });

  test("renders swagger and h2 console links when enabled", async () => {
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingBoth);
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DeveloperPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(
      await screen.findByTestId("developer-swagger-link"),
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId("developer-h2-console-link"),
    ).toBeInTheDocument();
  });
});
