import { fireEvent, render, waitFor} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import AdminLoadSubjectsPage from "main/pages/AdminLoadSubjectsPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("AdminLoadSubjectsPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);
    const testId = "UCSBSubjectsTable";

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };


    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/UCSBSubjects/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminLoadSubjectsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });


    test("renders three earthquakes without crashing for regular user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/UCSBSubjects/all").reply(200, ucsbSubjectsFixtures.threeSubjects);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminLoadSubjectsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-subjectCode`)).toHaveTextContent("GEOG"); });
        expect(getByTestId(`${testId}-cell-row-1-col-subjectCode`)).toHaveTextContent("GER");
        expect(getByTestId(`${testId}-cell-row-2-col-subjectCode`)).toHaveTextContent("GREEK");
    });


    test("test what happens when you click load, admin - originally nothing in table, load 3 subjects", async () => {

        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/UCSBSubjects/all").reply(200, []);
        axiosMock.onPost("/api/UCSBSubjects/load").reply(200, ucsbSubjectsFixtures.threeSubjects);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminLoadSubjectsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`AdminLoadSubjects-Load-Button`)).toBeInTheDocument(); });

        const loadButton = getByTestId(`AdminLoadSubjects-Load-Button`);
        expect(loadButton).toBeInTheDocument();
        fireEvent.click(loadButton);
        
        await waitFor(() =>  expect(axiosMock.history.post.length).toBe(1));
        expect(mockToast).toBeCalledWith("Number of Subjects Loaded : 3");
    });

    test("test what happens when you click load, admin - originally 3 subjects, load nothing", async () => {

        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/UCSBSubjects/all").reply(200, ucsbSubjectsFixtures.threeSubjects);
        axiosMock.onPost("/api/UCSBSubjects/load").reply(200, []);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminLoadSubjectsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`AdminLoadSubjects-Load-Button`)).toBeInTheDocument(); });

        const loadButton = getByTestId(`AdminLoadSubjects-Load-Button`);
        expect(loadButton).toBeInTheDocument();
        fireEvent.click(loadButton);
        
        await waitFor(() =>  expect(axiosMock.history.post.length).toBe(1));
        expect(mockToast).toBeCalledWith("Number of Subjects Loaded : -3");
    });

    

});