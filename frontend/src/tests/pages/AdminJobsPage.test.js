
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import AdminJobsPage from "main/pages/AdminJobsPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import jobsFixtures from "fixtures/jobsFixtures";

describe("AdminJobsPage tests", () => {
    const queryClient = new QueryClient();
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/jobs/all").reply(200, jobsFixtures.sixJobs);

    });

    test("renders without crashing", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminJobsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(await screen.findByText("Launch Jobs")).toBeInTheDocument();
        expect(await screen.findByText("Job Status")).toBeInTheDocument();

        ["Test Job", "Update Courses Database", "Update Grade Info"].map(
            (jobName) => expect(screen.getByText(jobName)).toBeInTheDocument()
        );


        const testId = "JobsTable";

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-Created`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-Updated`)).toHaveTextContent("11/13/2022, 19:49:59");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-status`)).toHaveTextContent("complete");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-Log`)).toHaveTextContent("Hello World! from test job!Goodbye from test job!");

    });

    test("user can submit a test job", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminJobsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(await screen.findByText("Test Job")).toBeInTheDocument();

        const testJobButton = screen.getByText("Test Job");
        expect(testJobButton).toBeInTheDocument();
        testJobButton.click();

        expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();

        const sleepMsInput = screen.getByTestId("TestJobForm-sleepMs");
        const submitButton = screen.getByTestId("TestJobForm-Submit-Button");

        expect(sleepMsInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();

        fireEvent.change(sleepMsInput, { target: { value: '0' } })
        submitButton.click();

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].url).toBe("/api/jobs/launch/testjob?fail=false&sleepMs=0");
});


});
