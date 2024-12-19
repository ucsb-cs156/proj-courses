import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { allTheSubjects } from "fixtures/subjectFixtures";

import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import UpdatesSearchForm from "main/components/Updates/UpdatesSearchForm";

describe("UpdatesSearchForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const queryClient = new QueryClient();

  const updateSubjectArea = jest.fn();
  const updateQuarter = jest.fn();
  const updateSortField = jest.fn();
  const updateSortDirection = jest.fn();
  const updatePageSize = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);
    axiosMock.onGet("/api/systemInfo").reply(200, {
      ...systemInfoFixtures.showingNeither,
      startQtrYYYYQ: "20201",
      endQtrYYYYQ: "20214",
    });
  });

  test("renders correctly, with ALL values in quarter and subject area dropdowns", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdatesSearchForm
            updateQuarter={updateQuarter}
            updateSubjectArea={updateSubjectArea}
            updateSortDirection={updateSortDirection}
            updateSortField={updateSortField}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      screen.getByTestId("UpdatesSearch.Quarter-option-all"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("UpdatesSearch.SubjectArea-option-all"),
    ).toBeInTheDocument();
  });

  test("when I select a quarter, the state for quarter changes and local storage is updated", () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdatesSearchForm
            updateQuarter={updateQuarter}
            updateSubjectArea={updateSubjectArea}
            updateSortDirection={updateSortDirection}
            updateSortField={updateSortField}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20212");
    expect(selectQuarter.value).toBe("20212");
    expect(setItemSpy).toHaveBeenCalledWith("UpdatesSearch.Quarter", "20212");
    expect(updateQuarter).toHaveBeenCalledWith("20212");
  });

  test("when I select a subject, the state for subject changes", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdatesSearchForm
            updateQuarter={updateQuarter}
            updateSubjectArea={updateSubjectArea}
            updateSortDirection={updateSortDirection}
            updateSortField={updateSortField}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "UpdatesSearch.SubjectArea-option-MATH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "MATH");

    expect(selectSubject.value).toBe("MATH");
    expect(setItemSpy).toHaveBeenCalledWith(
      "UpdatesSearch.SubjectArea",
      "MATH",
    );
    expect(updateSubjectArea).toHaveBeenCalledWith("MATH");
  });

  test("when I select a sortField, the state for sortField changes", () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdatesSearchForm
            updateQuarter={updateQuarter}
            updateSubjectArea={updateSubjectArea}
            updateSortDirection={updateSortDirection}
            updateSortField={updateSortField}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectSortField = screen.getByLabelText("Sort By");
    userEvent.selectOptions(selectSortField, "quarter");
    expect(selectSortField.value).toBe("quarter");
    expect(setItemSpy).toHaveBeenCalledWith(
      "UpdatesSearch.SortField",
      "quarter",
    );
  });

  test("when I select a sortDirection, the state for sortDirection changes", () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdatesSearchForm
            updateQuarter={updateQuarter}
            updateSubjectArea={updateSubjectArea}
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
      "UpdatesSearch.SortDirection",
      "ASC",
    );

    userEvent.selectOptions(selectSortDirection, "DESC");
    expect(selectSortDirection.value).toBe("DESC");
    expect(setItemSpy).toHaveBeenCalledWith(
      "UpdatesSearch.SortDirection",
      "DESC",
    );
  });

  test("when I select a pageSize, the state for pageSize changes", () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdatesSearchForm
            updateQuarter={updateQuarter}
            updateSubjectArea={updateSubjectArea}
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
    expect(setItemSpy).toHaveBeenCalledWith("UpdatesSearch.PageSize", "200");
  });

  test("renders correctly when fallback values are used", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
      startQtrYYYYQ: null, // use fallback value
      endQtrYYYYQ: null, // use fallback value
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UpdatesSearchForm
            updateQuarter={updateQuarter}
            updateSubjectArea={updateSubjectArea}
            updateSortDirection={updateSortDirection}
            updateSortField={updateSortField}
            updatePageSize={updatePageSize}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Make sure the first and last options are what we expect
    expect(
      await screen.findByTestId(/UpdatesSearch.Quarter-option-0/),
    ).toHaveValue("20211");
    expect(
      await screen.findByTestId(/UpdatesSearch.Quarter-option-3/),
    ).toHaveValue("20214");
    expect(setItemSpy).toHaveBeenCalledWith("UpdatesSearch.SubjectArea", "ALL");
  });
});
