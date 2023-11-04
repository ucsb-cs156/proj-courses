import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import AdminPersonalSchedulePage from "main/pages/AdminPersonalSchedulePage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("AdminPersonalSchedulePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  axiosMock
    .onGet("/api/currentUser")
    .reply(200, apiCurrentUserFixtures.userOnly);
  axiosMock
    .onGet("/api/systemInfo")
    .reply(200, systemInfoFixtures.showingNeither);

  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminPersonalSchedulePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });
});
