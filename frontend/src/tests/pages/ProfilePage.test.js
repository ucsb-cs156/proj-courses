import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import ProfilePage from "main/pages/ProfilePage";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

describe("ProfilePage tests", () => {
  const queryClient = new QueryClient();

  test("renders correctly for regular logged in user", async () => {
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Phillip Conrad")).toBeInTheDocument();
    expect(screen.getByText("pconrad.cis@gmail.com")).toBeInTheDocument();
  });

  test("renders correctly for admin user", async () => {
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("Phill Conrad")).toBeInTheDocument();
    expect(screen.getByText("phtcon@ucsb.edu")).toBeInTheDocument();
    expect(screen.getByTestId("role-badge-user")).toBeInTheDocument();
    expect(screen.getByTestId("role-badge-admin")).toBeInTheDocument();
    expect(screen.getByTestId("role-badge-member")).toBeInTheDocument();
  });
});
