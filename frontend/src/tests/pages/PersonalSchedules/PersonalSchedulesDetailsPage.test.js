import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import PersonalSchedulesDetailsPage from "main/pages/PersonalSchedules/PersonalSchedulesDetailsPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("PersonalSchedulesDetailsPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "PersonalSchedulesTable";

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    beforeEach(() => {
        jest.spyOn(console, 'error')
        console.error.mockImplementation(() => null);
    });

    afterEach(() => {
        console.error.mockRestore()
    })

    test("renders without crashing for regular user", () => {
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/personalschedules/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PersonalSchedulesDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("shows the correct info for admin users", async() => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet(`/api/personalschedules?id=17`).reply(200, {
                "id": 17,
                "user": {
                  "id": 1,
                  "email": "phtcon@ucsb.edu",
                  "googleSub": "115856948234298493496",
                  "pictureUrl": "https://lh3.googleusercontent.com/-bQynVrzVIrU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmkGuVsELD1ZeV5iDUAUfe6_K-p8w/s96-c/photo.jpg",
                  "fullName": "Phill Conrad",
                  "givenName": "Phill",
                  "familyName": "Conrad",
                  "emailVerified": true,
                  "locale": "en",
                  "hostedDomain": "ucsb.edu",
                  "admin": true
                },
                "description": "My Winter Courses",
                "quarter": "20221",
                "name": "CS156"
              
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PersonalSchedulesDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await waitFor(()=>{
             expect(screen.getByText("PersonalSchedules Details")).toBeInTheDocument();
        });
        await waitFor(()=>{
            expect(screen.getByTestId("PersonalSchedulesTable-cell-row-0-col-id")).toHaveTextContent("17");
       });
       
        expect(screen.getByTestId(`${testId}-cell-row-0-col-description`)).toHaveTextContent("My Winter Courses");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("CS156");

    });

});