import { render, screen } from "@testing-library/react";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/GeneralEducationSearchPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("GeneralEducationSearchPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();
  test("Renders expected content", async () => {
    // arrange

    setupUserOnly();

    // act

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("GE Search coming soon!");

    // assert
    expect(screen.getByText("GE Search coming soon!")).toBeInTheDocument();
  });
});
