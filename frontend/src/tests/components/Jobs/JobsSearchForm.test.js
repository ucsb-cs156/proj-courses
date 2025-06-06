import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import JobsSearchForm from "main/components/Jobs/JobsSearchForm";

describe("JobsSearchForm tests", () => {
  const queryClient = new QueryClient();

  const updateSortField = jest.fn();
  const updateSortDirection = jest.fn();
  const updatePageSize = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);
  });

  test("when I select a sortField, the state for sortField changes", () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

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
    userEvent.selectOptions(selectSortField, "status");
    expect(selectSortField.value).toBe("status");
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.SortField", "status");
  });

  test("when I select a sortDirection, the state for sortDirection changes", () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

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
    userEvent.selectOptions(selectSortDirection, "DESC");
    expect(selectSortDirection.value).toBe("DESC");
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.SortDirection", "DESC");

    userEvent.selectOptions(selectSortDirection, "DESC");
    expect(selectSortDirection.value).toBe("DESC");
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.SortDirection", "DESC");
  });

  test("when I select a pageSize, the state for pageSize changes", () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

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
    userEvent.selectOptions(selectPageSize, "10");
    expect(selectPageSize.value).toBe("10");
    expect(setItemSpy).toHaveBeenCalledWith("JobsSearch.PageSize", "10");
  });

  test("renders correctly when fallback values are used", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

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
    expect(setItemCalls).toContainEqual(["JobsSearch.SortField", "createdAt"]);
    expect(setItemCalls).toContainEqual(["JobsSearch.SortDirection", "ASC"]);
    expect(setItemCalls).toContainEqual(["JobsSearch.PageSize", "5"]);
  });
});
