import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import JobsSearchForm from "main/components/Jobs/JobsSearchForm";

describe("JobsSearchForm tests", () => {
  const queryClient = new QueryClient();

  const updateSortField = vi.fn();
  const updateSortDirection = vi.fn();
  const updatePageSize = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error");
    console.error.mockImplementation(() => null);
  });

  test("renders correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsSearchForm
            updateSortField={updateSortField}
            updateSortDirection={updateSortDirection}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByLabelText("Sort By")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort Direction")).toBeInTheDocument();
    expect(screen.getByLabelText("Page Size")).toBeInTheDocument();
  });

  test("when I select a sortField, the callback is called", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsSearchForm
            updateSortField={updateSortField}
            updateSortDirection={updateSortDirection}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectSortField = screen.getByLabelText("Sort By");
    userEvent.selectOptions(selectSortField, "createdAt");
    expect(updateSortField).toHaveBeenCalledWith("createdAt");
  });

  test("when I select a sortDirection, the callback is called", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsSearchForm
            updateSortField={updateSortField}
            updateSortDirection={updateSortDirection}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectSortDirection = screen.getByLabelText("Sort Direction");
    userEvent.selectOptions(selectSortDirection, "ASC");
    expect(updateSortDirection).toHaveBeenCalledWith("ASC");

    userEvent.selectOptions(selectSortDirection, "DESC");
    expect(updateSortDirection).toHaveBeenCalledWith("DESC");
  });

  test("when I select a pageSize, the callback is called", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <JobsSearchForm
            updateSortField={updateSortField}
            updateSortDirection={updateSortDirection}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectPageSize = screen.getByLabelText("Page Size");
    userEvent.selectOptions(selectPageSize, "200");
    expect(updatePageSize).toHaveBeenCalledWith("200");
  });
});
