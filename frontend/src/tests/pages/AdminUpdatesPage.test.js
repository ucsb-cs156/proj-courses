import { render, screen } from "@testing-library/react";
import AdminUpdatesPage from "main/pages/Admin/AdminUpdatesPage.js";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { allTheSubjects } from "fixtures/subjectFixtures";
import { updatesFixtures } from "fixtures/updatesFixtures";

describe("AdminUpdatesPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/updates")
      .reply(200, updatesFixtures.threeUpdatesPage);
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
  });

  const queryClient = new QueryClient();
  test("Renders expected content", async () => {
    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUpdatesPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    await screen.findByText("Updates");
  });

  test("When localstorage is empty, fallback values are used", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    const useLocalStorageSpy = jest.spyOn(
      require("main/utils/useLocalStorage"),
      "default",
    );

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminUpdatesPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Updates");
    expect(setItemSpy).toHaveBeenCalledWith("UpdatesSearch.SubjectArea", "ALL");
    expect(setItemSpy).toHaveBeenCalledWith("UpdatesSearch.Quarter", "ALL");
    expect(setItemSpy).toHaveBeenCalledWith(
      "UpdatesSearch.SortField",
      "subjectArea",
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      "UpdatesSearch.SortDirection",
      "ASC",
    );
    expect(setItemSpy).toHaveBeenCalledWith("UpdatesSearch.PageSize", "10");

    const calls = useLocalStorageSpy.mock.calls;
    let counts = {};
    for (const call of calls) {
      counts[call] = counts[call] ? counts[call] + 1 : 1;
    }

    expect(counts).toEqual({
      "UpdatesSearch.PageSize,10": 4,
      "UpdatesSearch.Quarter,ALL": 4,
      "UpdatesSearch.SortDirection,ASC": 4,
      "UpdatesSearch.SortField,subjectArea": 4,
      "UpdatesSearch.SubjectArea,ALL": 4,
    });

    expect(axiosMock.history.get.length).toBe(4);
    const urls = axiosMock.history.get.map((req) => req.url);
    expect(urls).toContain("/api/systemInfo");
    expect(urls).toContain("/api/UCSBSubjects/all");
    expect(urls).toContain("/api/currentUser");
    expect(urls).toContain("/api/updates");
    const updatesRequest = axiosMock.history.get.find(
      (req) => req.url === "/api/updates",
    );
    expect(updatesRequest.params).toEqual({
      quarter: "ALL",
      subjectArea: "ALL",
      page: 0,
      pageSize: "10",
      sortField: "subjectArea",
      sortDirection: "ASC",
    });
  });
});
