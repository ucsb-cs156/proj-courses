import { QueryClient, QueryClientProvider } from "react-query";
import { renderHook, act } from '@testing-library/react-hooks'
import mockConsole from "jest-mock-console";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { useBackend, useBackendMutation } from "main/utils/useBackend";


jest.mock('react-router-dom');

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});


describe("utils/useBackend tests", () => {
    describe("utils/useBackend useBackendMutation tests", () => {

        var axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
        });

        test("test useBackendMutation handles success correctly", async () => {
            const restoreConsole = mockConsole();

            // See: https://react-query.tanstack.com/guides/testing#turn-off-retries
            const queryClient = new QueryClient({
                defaultOptions: {
                    queries: {
                        // ✅ turns retries off
                        retry: false,
                    },
                },
            })
            const wrapper = ({ children }) => (
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            );


            axiosMock.onPost("/api/ucsbdates/post").reply(202, {
                id: 17,
                quarterYYYYQ: '20221',
                name: 'Groundhog Day',
                localDateTime: '2022-02-02T12:00'
            });

            const objectToAxiosParams = (ucsbDate) => ({
                url: "/api/ucsbdates/post",
                method: "POST",
                params: {
                    quarterYYYYQ: ucsbDate.quarterYYYYQ,
                    name: ucsbDate.name,
                    localDateTime: ucsbDate.localDateTime
                }
            });

            const onSuccess = jest.fn().mockImplementation((ucsbDate) => {
                mockToast(`New ucsbDate Created - id: ${ucsbDate.id} name: ${ucsbDate.name}`);
            });

            const { result, waitFor } = renderHook(
                () => useBackendMutation(objectToAxiosParams, { onSuccess }, ["/api/ucsbdates/all"]), { wrapper }
            );

            const mutation = result.current;
            act(() => mutation.mutate({
                quarterYYYYQ: '20221',
                name: 'Groundhog Day',
                localDateTime: '2022-02-02T12:00'
            }));

            await waitFor(() => expect(onSuccess).toHaveBeenCalled());
            expect(mockToast).toHaveBeenCalledWith("New ucsbDate Created - id: 17 name: Groundhog Day");
            restoreConsole();
        });

    });
});