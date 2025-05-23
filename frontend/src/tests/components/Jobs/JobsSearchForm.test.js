import { render, screen, fireEvent } from "@testing-library/react";
import JobsSearchForm from "main/components/Jobs/JobsSearchForm";

describe("JobsSearchForm", () => {
  const mockUpdateSortField = jest.fn();
  const mockUpdateSortDirection = jest.fn();
  const mockUpdatePageSize = jest.fn();
  const mockUpdateSelectedPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all dropdowns and pagination", () => {
    render(
      <JobsSearchForm
        updateSortField={mockUpdateSortField}
        updateSortDirection={mockUpdateSortDirection}
        updatePageSize={mockUpdatePageSize}
        updateSelectedPage={mockUpdateSelectedPage}
        totalPages={5}
      />,
    );

    expect(screen.getByLabelText("Sort By")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort Direction")).toBeInTheDocument();
    expect(screen.getByLabelText("Page Size")).toBeInTheDocument();
    expect(screen.getByTestId("OurPagination-1")).toBeInTheDocument();
  });

  test("renders all dropdown options correctly", () => {
    render(
      <JobsSearchForm
        updateSortField={mockUpdateSortField}
        updateSortDirection={mockUpdateSortDirection}
        updatePageSize={mockUpdatePageSize}
        updateSelectedPage={mockUpdateSelectedPage}
        totalPages={5}
      />,
    );

    const sortByOptions = Array.from(
      screen.getByLabelText("Sort By").options,
    ).map((o) => o.value);
    expect(sortByOptions).toEqual([
      "createdBy",
      "createdAt",
      "updatedAt",
      "status",
    ]);

    const sortDirectionOptions = Array.from(
      screen.getByLabelText("Sort Direction").options,
    ).map((o) => o.value);
    expect(sortDirectionOptions).toEqual(["ASC", "DESC"]);

    const pageSizeOptions = Array.from(
      screen.getByLabelText("Page Size").options,
    ).map((o) => o.value);
    expect(pageSizeOptions).toEqual(["5", "10", "25", "50", "75", "100"]);
  });

  test("calls updateSortField when changed", () => {
    render(
      <JobsSearchForm
        updateSortField={mockUpdateSortField}
        updateSortDirection={mockUpdateSortDirection}
        updatePageSize={mockUpdatePageSize}
        updateSelectedPage={mockUpdateSelectedPage}
        totalPages={5}
      />,
    );

    const dropdown = screen.getByLabelText("Sort By");
    fireEvent.change(dropdown, { target: { value: "status" } });
    expect(mockUpdateSortField).toHaveBeenCalledWith("status");
  });

  test("calls updateSortDirection when changed", () => {
    render(
      <JobsSearchForm
        updateSortField={mockUpdateSortField}
        updateSortDirection={mockUpdateSortDirection}
        updatePageSize={mockUpdatePageSize}
        updateSelectedPage={mockUpdateSelectedPage}
        totalPages={5}
      />,
    );

    const dropdown = screen.getByLabelText("Sort Direction");
    fireEvent.change(dropdown, { target: { value: "DESC" } });
    expect(mockUpdateSortDirection).toHaveBeenCalledWith("DESC");
  });

  test("calls updatePageSize when changed", () => {
    render(
      <JobsSearchForm
        updateSortField={mockUpdateSortField}
        updateSortDirection={mockUpdateSortDirection}
        updatePageSize={mockUpdatePageSize}
        updateSelectedPage={mockUpdateSelectedPage}
        totalPages={5}
      />,
    );

    const dropdown = screen.getByLabelText("Page Size");
    fireEvent.change(dropdown, { target: { value: "25" } });
    expect(mockUpdatePageSize).toHaveBeenCalledWith("25");
  });

  test("calls updateSelectedPage when a page number is clicked", () => {
    render(
      <JobsSearchForm
        updateSortField={mockUpdateSortField}
        updateSortDirection={mockUpdateSortDirection}
        updatePageSize={mockUpdatePageSize}
        updateSelectedPage={mockUpdateSelectedPage}
        totalPages={3}
      />,
    );

    const pageButton = screen.getByText("2");
    fireEvent.click(pageButton);
    expect(mockUpdateSelectedPage).toHaveBeenCalledWith(2);
  });
});
