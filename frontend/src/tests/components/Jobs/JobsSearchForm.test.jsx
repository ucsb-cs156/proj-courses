import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import JobsSearchForm from "main/components/Jobs/JobsSearchForm";

describe("JobsSearchForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const queryClient = new QueryClient();

  const setSortField = vi.fn();
  const setSortDirection = vi.fn();
  const setPageSize = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error");
    console.error.mockImplementation(() => null);
    axiosMock.onGet("/api/systemInfo").reply(200, {
      ...systemInfoFixtures.showingNeither,
    });
  });

  test("renders form correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsSearchForm
            updateSortField={setSortField}
            updateSortDirection={setSortDirection}
            updatePageSize={setPageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByLabelText("Sort By")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort Direction")).toBeInTheDocument();
    expect(screen.getByLabelText("Page Size")).toBeInTheDocument();
  });

  test("state for SortField changes correctly when new value is selected", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsSearchForm
            updateSortField={setSortField}
            updateSortDirection={setSortDirection}
            updatePageSize={setPageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectSortField = screen.getByLabelText("Sort By");
    userEvent.selectOptions(selectSortField, "createdAt");
    expect(selectSortField.value).toBe("createdAt");
    expect(setItemSpy).toHaveBeenCalledWith(
      "JobsSearch.SortField",
      "createdAt",
    );
  });

  test("state for sortDirection changes correctly when new value is selected", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsSearchForm
            updateSortField={setSortField}
            updateSortDirection={setSortDirection}
            updatePageSize={setPageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectSortDirection = screen.getByLabelText("Sort Direction");
    userEvent.selectOptions(selectSortDirection, "ASC");
    expect(selectSortDirection.value).toBe("ASC");
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.SortDirection", "ASC");

    userEvent.selectOptions(selectSortDirection, "DESC");
    expect(selectSortDirection.value).toBe("DESC");
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.SortDirection", "DESC");
  });

  test("pageSize changes correctly when new value is selected", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsSearchForm
            updateSortField={setSortField}
            updateSortDirection={setSortDirection}
            updatePageSize={setPageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectPageSize = screen.getByLabelText("Page Size");
    userEvent.selectOptions(selectPageSize, "500");
    expect(selectPageSize.value).toBe("500");
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.PageSize", "500");
  });

  test("renders correctly with initial values", async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsSearchForm
            updateSortField={setSortField}
            updateSortDirection={setSortDirection}
            updatePageSize={setPageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const setItemCalls = setItemSpy.mock.calls;
    expect(setItemCalls).toContainEqual(["JobsSearch.SortField", "id"]);
    expect(setItemCalls).toContainEqual(["JobsSearch.SortDirection", "ASC"]);
    expect(setItemCalls).toContainEqual(["JobsSearch.PageSize", "10"]);
  });
});
