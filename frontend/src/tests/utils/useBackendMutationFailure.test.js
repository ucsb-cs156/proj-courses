import { QueryClient, QueryClientProvider } from "react-query";
import { renderHook } from '@testing-library/react-hooks'
import mockConsole from "jest-mock-console";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { useBackendMutation } from "main/utils/useBackend";


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

        beforeEach( () => {
            axiosMock.reset();
            axiosMock.resetHistory();
        });

        test("useBackendMutation handles error correctly", async () => {

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

            axiosMock.onPost("/api/ucsbdates/post").reply(404);

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
                () => useBackendMutation(objectToAxiosParams, { onSuccess }), { wrapper }
            );

            const mutation = result.current;

            mutation.mutate({
                quarterYYYYQ: '20221',
                name: 'Groundhog Day',
                localDateTime: '2022-02-02T12:00'
            }, {
                onError: (e) => console.error("onError from mutation.mutate called!", String(e).substring(0, 199))
            });

            await waitFor(() => expect(mockToast).toHaveBeenCalled());
            expect(mockToast).toHaveBeenCalledTimes(2);
            expect(mockToast).toHaveBeenCalledWith("Axios Error: Error: Request failed with status code 404");
            expect(mockToast).toHaveBeenCalledWith("Error: Request failed with status code 404");

            expect(console.error).toHaveBeenCalledTimes(3);
            const errorMessage0 = console.error.mock.calls[0][0];
            expect(errorMessage0).toMatch(/Axios Error:/);
            const errorMessage1 = console.error.mock.calls[2][0];
            expect(errorMessage1).toBe("onError from mutation.mutate called!");
            restoreConsole();
        });
    });
});