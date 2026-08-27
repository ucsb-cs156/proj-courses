import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import UsersSearchForm from "main/components/Users/UsersSearchForm";

describe("UsersSearchForm tests", () => {
  const queryClient = new QueryClient();

  const setSortField = vi.fn();
  const setSortDirection = vi.fn();
  const setPageSize = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error");
    console.error.mockImplementation(() => null);
  });

  test("renders form correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UsersSearchForm
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

  test("when I select a sortField, the state for sortField changes", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UsersSearchForm
            updateSortField={setSortField}
            updateSortDirection={setSortDirection}
            updatePageSize={setPageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectSortField = screen.getByLabelText("Sort By");
    userEvent.selectOptions(selectSortField, "familyName");
    expect(selectSortField.value).toBe("familyName");
    expect(setItemSpy).toHaveBeenCalledWith(
      "UsersSearch.SortField",
      "familyName",
    );
  });

  test("when I select a sortDirection, the state for sortDirection changes", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UsersSearchForm
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
    expect(setItemSpy).toHaveBeenCalledWith("UsersSearch.SortDirection", "ASC");

    userEvent.selectOptions(selectSortDirection, "DESC");
    expect(selectSortDirection.value).toBe("DESC");
    expect(setItemSpy).toHaveBeenCalledWith(
      "UsersSearch.SortDirection",
      "DESC",
    );
  });

  test("when I select a pageSize, the state for pageSize changes", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UsersSearchForm
            updateSortField={setSortField}
            updateSortDirection={setSortDirection}
            updatePageSize={setPageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectPageSize = screen.getByLabelText("Page Size");
    userEvent.selectOptions(selectPageSize, "100");
    expect(selectPageSize.value).toBe("100");
    expect(setItemSpy).toHaveBeenCalledWith("UsersSearch.PageSize", "100");
  });

  test("renders correctly with default initial values", async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UsersSearchForm
            updateSortField={setSortField}
            updateSortDirection={setSortDirection}
            updatePageSize={setPageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const setItemCalls = setItemSpy.mock.calls;
    expect(setItemCalls).toContainEqual(["UsersSearch.SortField", "email"]);
    expect(setItemCalls).toContainEqual(["UsersSearch.SortDirection", "ASC"]);
    expect(setItemCalls).toContainEqual(["UsersSearch.PageSize", "10"]);
  });
});
