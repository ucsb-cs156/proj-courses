import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import DeveloperPage from "main/pages/DeveloperPage";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";

describe("DeveloperPage tests", () => {
  const queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);

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

  test("renders correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DeveloperPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(await screen.findByText("Developer Page")).toBeInTheDocument();
    expect(await screen.findByText("systemInfo")).toBeInTheDocument();
    expect(await screen.findByText("env")).toBeInTheDocument();
  });

  test("renders correctly when overrideEnv passed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DeveloperPage overrideEnv={{ foo: "bar" }} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(await screen.findByText("Developer Page")).toBeInTheDocument();
    expect(await screen.findByText("systemInfo")).toBeInTheDocument();
    expect(await screen.findByText("env")).toBeInTheDocument();
    expect(await screen.findByText("foo")).toBeInTheDocument();
    expect(await screen.findByText(/bar/)).toBeInTheDocument();
  });
});
