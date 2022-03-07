import { render } from "@testing-library/react";
import AdminLoadSubjectsPage from "main/pages/AdminLoadSubjectsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("AdminLoadSubjectsPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

    const queryClient = new QueryClient();
    test("renders without crashing for admin user", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminLoadSubjectsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });


});