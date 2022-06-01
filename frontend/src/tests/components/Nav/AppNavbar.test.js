import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import AppNavbar from "main/components/Nav/AppNavbar";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

describe("AppNavbar tests", () => {
    const queryClient = new QueryClient();

    test("renders correctly for regular logged in user", async () => {
        const currentUser = currentUserFixtures.userOnly;
        const doLogin = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText("Welcome, pconrad.cis@gmail.com")).toBeInTheDocument();
    });

    test("renders correctly for admin user", async () => {
        const currentUser = currentUserFixtures.adminUser;
        const doLogin = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText("Welcome, phtcon@ucsb.edu")).toBeInTheDocument();
        const adminMenu = screen.getByTestId("appnavbar-admin-dropdown");

        expect(adminMenu).toBeInTheDocument(); 
        
        const aElement = adminMenu.querySelector("a");
        expect(aElement).toBeInTheDocument();
        aElement?.click();

        expect(await screen.findByTestId(/appnavbar-admin-users/)).toBeInTheDocument();
        expect(screen.getByTestId("appnavbar-admin-loadsubjects")).toBeInTheDocument();      
        expect(screen.getByTestId(/appnavbar-admin-personalschedule/)).toBeInTheDocument();
    });

    test("renders H2Console and Swagger links correctly", async () => {
        const currentUser = currentUserFixtures.adminUser;
        const systemInfo = systemInfoFixtures.showingBoth;

        const doLogin = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} systemInfo={systemInfo} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText("H2Console")).toBeInTheDocument();
        expect(screen.getByText("Swagger")).toBeInTheDocument();        
    });

    test("renders the AppNavbarLocalhost when on http://localhost:3000", async () => {
        const currentUser = currentUserFixtures.userOnly;
        const systemInfo = systemInfoFixtures.showingBoth;
        const doLogin = jest.fn();

        delete window.location
        window.location = new URL('http://localhost:3000')

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} systemInfo={systemInfo} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("AppNavbarLocalhost")).toBeInTheDocument();
    });

    test("renders the AppNavbarLocalhost when on http://127.0.0.1:3000", async () => {
        const currentUser = currentUserFixtures.userOnly;
        const systemInfo = systemInfoFixtures.showingBoth;
        const doLogin = jest.fn();

        delete window.location
        window.location = new URL('http://127.0.0.1:3000')

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} systemInfo={systemInfo} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("AppNavbarLocalhost")).toBeInTheDocument();
    });

    test("does NOT render the AppNavbarLocalhost when on localhost:8080", async () => {
        const currentUser = currentUserFixtures.userOnly;
        const systemInfo = systemInfoFixtures.showingBoth;
        const doLogin = jest.fn();

        delete window.location
        window.location = new URL('http://localhost:8080')

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} systemInfo={systemInfo} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("AppNavbar")).toBeInTheDocument();
        expect(screen.queryByTestId(/AppNavbarLocalhost/i)).toBeNull();
    });

    test("renders the PersonalSchedules menu correctly", async () => {
        const currentUser = currentUserFixtures.userOnly;
        const systemInfo = systemInfoFixtures.showingBoth;

        const doLogin = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} systemInfo={systemInfo} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("appnavbar-personalschedules-dropdown")).toBeInTheDocument();
        const dropdown = screen.getByTestId("appnavbar-personalschedules-dropdown");
        const aElement = dropdown.querySelector("a");
        expect(aElement).toBeInTheDocument();
        aElement?.click();

        expect(await screen.findByTestId("appnavbar-personalschedules-list")).toBeInTheDocument();
        expect(screen.getByTestId(/appnavbar-personalschedules-create/)).toBeInTheDocument();
    });

    test("renders the Section Search menu correctly", async () => {
        const currentUser = currentUserFixtures.userOnly;
        const systemInfo = systemInfoFixtures.showingBoth;

        const doLogin = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AppNavbar currentUser={currentUser} systemInfo={systemInfo} doLogin={doLogin} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByTestId("appnavbar-section-searches-dropdown")).toBeInTheDocument();
        const dropdown = screen.getByTestId("appnavbar-section-searches-dropdown");
        const aElement = dropdown.querySelector("a");
        expect(aElement).toBeInTheDocument();
        aElement?.click();

        expect(await screen.findByTestId("appnavbar-section-searches-search")).toBeInTheDocument();
    });
});
