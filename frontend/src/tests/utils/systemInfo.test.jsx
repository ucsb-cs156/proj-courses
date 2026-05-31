import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "react-query";
import { useSystemInfo } from "main/utils/systemInfo";
import { renderHook, waitFor } from "@testing-library/react";
import mockConsole from "tests/testutils/mockConsole";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

vi.mock("react-router-dom");
const { _MemoryRouter } = await vi.importActual("react-router-dom");

describe("utils/systemInfo tests", () => {
  let queryClient;
  let axiosMock;
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    axiosMock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    queryClient.clear();
    axiosMock.restore();
    vi.clearAllMocks();
  });
  describe("useSystemInfo tests", () => {
    test("useSystemInfo retrieves initial data", async () => {
      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useSystemInfo(), { wrapper });

      expect(result.current.data).toEqual({
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: "20221",
        endQtrYYYYQ: "20222",
      });

      const queryState = queryClient.getQueryState("systemInfo");
      expect(queryState).toBeDefined();

      // Wait for any pending async fetch to complete to avoid act() warnings
      await waitFor(() => result.current.isFetched);
    });

    test("useSystemInfo retrieves data from API", async () => {
      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const axiosMock = new AxiosMockAdapter(axios);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingBoth);

      const { result } = renderHook(() => useSystemInfo(), {
        wrapper,
      });

      await waitFor(() => result.current.isFetched);

      expect(result.current.data).toEqual(systemInfoFixtures.showingBoth);
      queryClient.clear();
    });

    test("useSystemInfo does not refetch when data is already cached (within staleTime)", async () => {
      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingBoth);

      const { result: result1 } = renderHook(() => useSystemInfo(), {
        wrapper,
      });

      await waitFor(() => result1.current.isFetched);
      expect(axiosMock.history.get.length).toBe(1);

      // Render a second instance of the hook; it should use cached data and not call the API again
      const { result: result2 } = renderHook(() => useSystemInfo(), {
        wrapper,
      });

      await waitFor(() => result2.current.isFetched);
      expect(axiosMock.history.get.length).toBe(1);

      expect(result2.current.data).toEqual(systemInfoFixtures.showingBoth);
    });

    test("systemInfo when API unreachable", async () => {
      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const axiosMock = new AxiosMockAdapter(axios);
      axiosMock.onGet("/api/systemInfo").reply(404);

      const restoreConsole = mockConsole();
      const { result } = renderHook(() => useSystemInfo(), {
        wrapper,
      });

      await waitFor(() => result.current.isFetched);
      expect(console.error).toHaveBeenCalled();
      const errorMessage = console.error.mock.calls[0][0];
      expect(errorMessage).toMatch(/Error invoking axios.get:/);
      restoreConsole();

      expect(result.current.data).toEqual({});
    });
  });
});
