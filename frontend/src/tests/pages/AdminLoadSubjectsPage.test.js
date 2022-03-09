import { render } from "@testing-library/react";
import AdminLoadSubjectsPage from "main/pages/AdminLoadSubjectsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("AdminLoadSubjectsPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);
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

    test("Refresh button works", async () => {
        const axiosMock = new AxiosMockAdapter(axios);
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

        const { getByText, getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminLoadSubjectsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const editButton = getByTestId(`UCSBSubjectsTable-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();

        fireEvent.click(editButton);
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/UCSBSubjects/edit/1'));
    });
    test("Toast displays  properly", async () => {

        const currentUser = currentUserFixtures.adminUser;

        const { getByText, getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBSubjectsTable subjects={ucsbSubjectsFixtures.threeSubjects} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>

        );

        await waitFor(() => { expect(getByTestId(`UCSBSubjectsTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

        const editButton = getByTestId(`UCSBSubjectsTable-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();

        fireEvent.click(editButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/UCSBSubjects/edit/1'));

    });


});