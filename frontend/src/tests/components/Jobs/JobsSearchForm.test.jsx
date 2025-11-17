import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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

  const updateSortField = vi.fn();
  const updateSortDirection = vi.fn();
  const updatePageSize = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error");
    console.error.mockImplementation(() => null);
    axiosMock.onGet("/api/systemInfo").reply(200, {
      ...systemInfoFixtures.showingNeither
    });
  });

  test("renders correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsSearchForm
            updateSortDirection={updateSortDirection}
            updateSortField={updateSortField}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      screen.getByTestId("JobsSearch.SortField-option-0"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("JobsSearch.SortDirection-option-0"),
    ).toBeInTheDocument();
  });

  test("when I select a sortField, the state for sortField changes", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsSearchForm
            updateSortDirection={updateSortDirection}
            updateSortField={updateSortField}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectSortField = screen.getByLabelText("Sort By");
    userEvent.selectOptions(selectSortField, "updatedAt");
    expect(selectSortField.value).toBe("updatedAt");
    expect(setItemSpy).toHaveBeenCalledWith(
      "JobsSearch.SortField",
      "updatedAt",
    );
  });

  test("when I select a sortDirection, the state for sortDirection changes", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsSearchForm
            updateSortDirection={updateSortDirection}
            updateSortField={updateSortField}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectSortDirection = screen.getByLabelText("Sort Direction");
    userEvent.selectOptions(selectSortDirection, "ASC");
    expect(selectSortDirection.value).toBe("ASC");
    expect(setItemSpy).toHaveBeenCalledWith(
      "JobsSearch.SortDirection",
      "ASC",
    );

    userEvent.selectOptions(selectSortDirection, "DESC");
    expect(selectSortDirection.value).toBe("DESC");
    expect(setItemSpy).toHaveBeenCalledWith(
      "JobsSearch.SortDirection",
      "DESC",
    );
  });

  test("when I select a pageSize, the state for pageSize changes", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsSearchForm
            updateSortDirection={updateSortDirection}
            updateSortField={updateSortField}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectPageSize = screen.getByLabelText("Page Size");
    userEvent.selectOptions(selectPageSize, "200");
    expect(selectPageSize.value).toBe("200");
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.PageSize", "200");
  });

  test("renders correctly when fallback values are used", async () => {
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
            updateSortDirection={updateSortDirection}
            updateSortField={updateSortField}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const setItemCalls = setItemSpy.mock.calls;
    expect(setItemCalls).toContainEqual([
      "JobsSearch.SortField",
      "id",
    ]);
    expect(setItemCalls).toContainEqual(["JobsSearch.SortDirection", "ASC"]);
    expect(setItemCalls).toContainEqual(["JobsSearch.PageSize", "10"]);
  });
});
