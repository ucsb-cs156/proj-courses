import { QueryClient, QueryClientProvider } from "react-query";
import { useCurrentUser, useLogout, hasRole } from "main/utils/currentUser";
import { renderHook, waitFor } from "@testing-library/react";
import {
  apiCurrentUserFixtures,
  currentUserFixtures,
} from "fixtures/currentUserFixtures";
import mockConsole from "jest-mock-console";
import { act } from "react";
import { useNavigate } from "react-router-dom";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

let axiosMock;

jest.mock("react-router-dom");
const { MemoryRouter } = jest.requireActual("react-router-dom");

describe("utils/currentUser tests", () => {
  describe("useCurrentUser tests", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
    });

    afterEach(() => {
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    test("useCurrentUser retrieves initial data", async () => {
      const queryClient = new QueryClient();
      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      axiosMock.onGet("/api/currentUser").timeoutOnce();
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);

      const restoreConsole = mockConsole();

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper,
      });
      await waitFor(() => result.current.isSuccess);

      expect(result.current.data).toEqual({
        loggedIn: false,
        root: null,
        initialData: true,
      });

      const queryState = queryClient.getQueryState("current user");
      expect(queryState).toBeDefined();

      queryClient.clear();

      await waitFor(() => expect(console.error).toHaveBeenCalled());
      const errorMessage = console.error.mock.calls[0][0];
      expect(errorMessage).toMatch(/Error invoking axios.get:/);
      restoreConsole();
    });

    // test.only("useCurrentUser retrieves data from API", async () => {
    //   const queryClient = new QueryClient();
    //   const wrapper = ({ children }) => (
    //     <QueryClientProvider client={queryClient}>
    //       {children}
    //     </QueryClientProvider>
    //   );

    //   axiosMock
    //     .onGet("/api/currentUser")
    //     .reply(200, apiCurrentUserFixtures.userOnly);
    //   axiosMock
    //     .onGet("/api/systemInfo")
    //     .reply(200, systemInfoFixtures.showingNeither);

    //   const { result } = renderHook(() => useCurrentUser(), {
    //     wrapper,
    //   });

    //   await waitFor(() => result.current.isFetched);

    //   expect(result.current.data).toEqual(currentUserFixtures.userOnly);
    //   queryClient.clear();
    // });

    test("useCurrentUser when API unreachable", async () => {
      const queryClient = new QueryClient();
      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      axiosMock.onGet("/api/currentUser").reply(404);

      const restoreConsole = mockConsole();
      const { result } = renderHook(() => useCurrentUser(), {
        wrapper,
      });

      await waitFor(() => result.current.isFetched);
      expect(console.error).toHaveBeenCalled();
      const errorMessage = console.error.mock.calls[0][0];
      expect(errorMessage).toMatch(/Error invoking axios.get:/);
      restoreConsole();

      expect(result.current.data).toEqual({
        initialData: true,
        loggedIn: false,
        root: null,
      });
      queryClient.clear();
    });

    test("useCurrentUser when API times out", async () => {
      const queryClient = new QueryClient();
      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      axiosMock.onGet("/api/currentUser").timeout();

      const restoreConsole = mockConsole();
      const { result } = renderHook(() => useCurrentUser(), {
        wrapper,
      });

      await waitFor(() => result.current.isFetched);
      expect(console.error).toHaveBeenCalled();
      const errorMessage = console.error.mock.calls[0][0];
      expect(errorMessage).toMatch(/Error invoking axios.get:/);
      restoreConsole();

      expect(result.current.data).toEqual({
        initialData: true,
        loggedIn: false,
        root: null,
      });
      queryClient.clear();
    });
  });

  describe("useLogout tests", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
    });

    test("useLogout", async () => {
      const queryClient = new QueryClient();
      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>{children}</MemoryRouter>
        </QueryClientProvider>
      );

      axiosMock.onPost("/logout").reply(200);

      const navigateSpy = jest.fn();
      useNavigate.mockImplementation(() => navigateSpy);

      const resetQueriesSpy = jest.spyOn(queryClient, "resetQueries");

      const { result } = renderHook(() => useLogout(), { wrapper });

      act(() => {
        expect(useNavigate).toHaveBeenCalled();
        result.current.mutate();
      });
      await waitFor(() => expect(navigateSpy).toHaveBeenCalledWith("/"));

      await waitFor(() =>
        expect(resetQueriesSpy).toHaveBeenCalledWith("current user", {
          exact: true,
        }),
      );

      queryClient.clear();
    });
  });
  describe("hasRole tests", () => {
    test('hasRole(x,"ROLE_ADMIN") return falsy when currentUser ill-defined', async () => {
      expect(hasRole(null, "ROLE_ADMIN")).toBeFalsy();
      expect(hasRole({}, "ROLE_ADMIN")).toBeFalsy();
      expect(hasRole({ loggedIn: null }, "ROLE_ADMIN")).toBeFalsy();
      expect(hasRole({ loggedIn: true }, "ROLE_ADMIN")).toBeFalsy();
      expect(hasRole({ loggedIn: true, root: null }, "ROLE_ADMIN")).toBeFalsy();
      expect(hasRole({ loggedIn: true, root: {} }, "ROLE_ADMIN")).toBeFalsy();
      expect(
        hasRole({ loggedIn: true, root: { rolesList: null } }, "ROLE_ADMIN"),
      ).toBeFalsy();
    });

    test("some code paths when data is in currentUser", async () => {
      expect(hasRole({ data: {} }, "ROLE_ADMIN")).toBeFalsy();
      expect(hasRole({ data: { root: null } }, "ROLE_ADMIN")).toBeFalsy();
      expect(hasRole({ data: { root: {} } }, "ROLE_ADMIN")).toBeFalsy();
      expect(
        hasRole({ data: { root: { rolesList: [] } } }, "ROLE_ADMIN"),
      ).toBeFalsy();
      expect(
        hasRole({ data: { root: { rolesList: ["ROLE_USER"] } } }, "ROLE_ADMIN"),
      ).toBeFalsy();
      expect(
        hasRole(
          { data: { root: { rolesList: ["ROLE_USER", "ROLE_ADMIN"] } } },
          "ROLE_ADMIN",
        ),
      ).toBeTruthy();
    });

    test('hasRole(x,"ROLE_ADMIN") returns correct values when currentUser properly defined', async () => {
      expect(
        hasRole({ loggedIn: true, root: { rolesList: [] } }, "ROLE_ADMIN"),
      ).toBeFalsy();
      expect(
        hasRole(
          { loggedIn: true, root: { rolesList: ["ROLE_USER"] } },
          "ROLE_ADMIN",
        ),
      ).toBeFalsy();
      expect(
        hasRole(
          { loggedIn: true, root: { rolesList: ["ROLE_USER", "ROLE_ADMIN"] } },
          "ROLE_ADMIN",
        ),
      ).toBeTruthy();
    });
  });
});
