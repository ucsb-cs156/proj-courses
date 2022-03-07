import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBSubjectsEditPage from "main/pages/UCSBSubjects/UCSBSubjectsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
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

describe("UCSBSubjectsEditPage tests", () => {

    describe("when the backend doesn't return a subject", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbsubjects", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {
            const {getByText, queryByTestId} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBSubjectsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await waitFor(() => expect(getByText("Edit UCSBSubject")).toBeInTheDocument());
            expect(queryByTestId("UCSBSubjectForm-subjectCode")).not.toBeInTheDocument();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbsubjects", { params: { id: 17 } }).reply(200, {
                id: 17,
                subjectCode: "CMPCS",
                subjectTranslation: "CMPCStrans",
                deptCode: "CSdept",
                collegeCode: "COE",
                relatedDeptCode: "MATH",
                inactive: "true"
            });
            axiosMock.onPut('/api/ucsbsubjects').reply(200, {
                id: "17",
                subjectCode: "PHYS",
                subjectTranslation: "CMPCStrans",
                deptCode: "CSdept",
                collegeCode: "COE",
                relatedDeptCode: "MATH",
                inactive: "false"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBSubjectsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBSubjectsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("UCSBSubjectForm-subjectCode")).toBeInTheDocument());

            const idField = getByTestId("UCSBSubjectForm-id");
            const subjectCodeField = getByTestId("UCSBSubjectForm-subjectCode");
            const subjectTranslationField = getByTestId(
              "UCSBSubjectForm-subjectTranslation"
            );
            const deptCodeField = getByTestId("UCSBSubjectForm-deptCode");
            const collegeCodeField = getByTestId("UCSBSubjectForm-collegeCode");
            const relatedDeptCodeField = getByTestId("UCSBSubjectForm-relatedDeptCode");
            const inactiveField = getByTestId("UCSBSubjectForm-inactive");
            const submitButton = getByTestId("UCSBSubjectForm-submit");

            expect(idField).toHaveValue("17");
            expect(subjectCodeField).toHaveValue("CMPCS");
            expect(subjectTranslationField).toHaveValue("CMPCStrans");
            expect(deptCodeField).toHaveValue("CSdept");
            expect(collegeCodeField).toHaveValue("COE");
            expect(relatedDeptCodeField).toHaveValue("MATH");
            expect(inactiveField).toHaveValue("true");
        });

        test("Changes when you click Update", async () => {
            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBSubjectsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("UCSBSubjectForm-subjectCode")).toBeInTheDocument());

            const idField = getByTestId("UCSBSubjectForm-id");
            const subjectCodeField = getByTestId("UCSBSubjectForm-subjectCode");
            const subjectTranslationField = getByTestId(
              "UCSBSubjectForm-subjectTranslation"
            );
            const deptCodeField = getByTestId("UCSBSubjectForm-deptCode");
            const collegeCodeField = getByTestId("UCSBSubjectForm-collegeCode");
            const relatedDeptCodeField = getByTestId("UCSBSubjectForm-relatedDeptCode");
            const inactiveField = getByTestId("UCSBSubjectForm-inactive");
            const submitButton = getByTestId("UCSBSubjectForm-submit");

            expect(idField).toHaveValue("17");
            expect(subjectCodeField).toHaveValue("CMPCS");
            expect(subjectTranslationField).toHaveValue("CMPCStrans");
            expect(deptCodeField).toHaveValue("CSdept");
            expect(collegeCodeField).toHaveValue("COE");
            expect(relatedDeptCodeField).toHaveValue("MATH");
            expect(inactiveField).toHaveValue("true");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(subjectCodeField, { target: { value: 'PHYS' } });
            fireEvent.change(subjectTranslationField, { target: { value: 'CMPCStrans' } });
            fireEvent.change(deptCodeField, { target: { value: 'CSdept' } });
            fireEvent.change(collegeCodeField, { target: { value: 'COE'} });
            fireEvent.change(relatedDeptCodeField, { target: { value: 'MATH' } });
            fireEvent.change(inactiveField, { target: { value: "false"} });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith(
                "UCSBSubject Updated - id: 17"
            );
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsbsubjects/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                subjectCode: "PHYS",
                subjectTranslation: "CMPCStrans",
                deptCode: "CSdept",
                collegeCode: "COE",
                relatedDeptCode: "MATH",
                inactive: "false"
            })); // posted object

        });

       
    });
});

