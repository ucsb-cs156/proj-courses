import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { allTheGEAreas } from "fixtures/GEAreaFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import GeneralEducationSearchForm from "main/components/GeneralEducation/GeneralEducationSearchForm";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("GeneralEducationSearchForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const queryClient = new QueryClient();
  const addToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);

    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, {
      ...systemInfoFixtures.showingNeither,
      startQtrYYYYQ: "20201",
      endQtrYYYYQ: "20214",
    });

    toast.mockReturnValue({
      addToast: addToast,
    });
  });

  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("when I select a quarter, the state for quarter changes", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectQuarter, "20204");
    expect(selectQuarter.value).toBe("20204");
  });

  test("when I select a ge area, the state for ge area changes", async () => {
    axiosMock
      .onGet("/api/public/generalEducationInfo")
      .reply(200, allTheGEAreas);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "GeneralEducationSearch.GEArea-option-A1";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectGEArea = screen.getByLabelText("GE Area");
    userEvent.selectOptions(selectGEArea, "A2");

    expect(selectGEArea.value).toBe("A2");
  });

  test("when I click submit, the right stuff happens", async () => {
    axiosMock
      .onGet("/api/public/generalEducationInfo")
      .reply(200, allTheGEAreas);
    const sampleReturnValue = {
      sampleKey: "sampleValue",
    };

    const fetchJSONSpy = jest.fn();

    fetchJSONSpy.mockResolvedValue(sampleReturnValue);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedFields = {
      quarter: "20201",
      geArea: "A1",
    };

    const selectQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectQuarter, "20201");
    const expectedKey = "GeneralEducationSearch.GEArea-option-A1";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectGEArea = screen.getByLabelText("GE Area");
    userEvent.selectOptions(selectGEArea, "A1");
    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

    expect(fetchJSONSpy).toHaveBeenCalledWith(
      expect.any(Object),
      expectedFields,
    );
  });

  test("when I click submit when JSON is EMPTY, setCourse is not called!", async () => {
    axiosMock
      .onGet("/api/public/generalEducationInfo")
      .reply(200, allTheGEAreas);

    const sampleReturnValue = {
      sampleKey: "sampleValue",
      total: 0,
    };

    const fetchJSONSpy = jest.fn();

    fetchJSONSpy.mockResolvedValue(sampleReturnValue);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "GeneralEducationSearch.GEArea-option-A1";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectQuarter, "20204");
    const selectSubject = screen.getByLabelText("GE Area");
    userEvent.selectOptions(selectSubject, "A1");
    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);
  });

  test("renders without crashing when fallback values are used", async () => {
    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
      startQtrYYYYQ: null, // use fallback value
      endQtrYYYYQ: null, // use fallback value
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Make sure the first and last options
    expect(
      await screen.findByTestId(/GeneralEducationSearch.StartQuarter-option-0/),
    ).toHaveValue("20211");
    expect(
      await screen.findByTestId(/GeneralEducationSearch.EndQuarter-option-3/),
    ).toHaveValue("20214");
  });

  test("renders the End Quarter dropdown with the correct label", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByLabelText("End Quarter")).toBeInTheDocument();
  });

  test("submit row has the correct padding style", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const row = screen.getByTestId("GeneralEducationSearchForm-submit-row");
    expect(row).toHaveStyle({
      paddingTop: "10px",
      paddingBottom: "10px",
    });
  });

  test("GE area selection changes are reflected in form submission", async () => {
    axiosMock
      .onGet("/api/public/generalEducationInfo")
      .reply(200, allTheGEAreas);

    const fetchJSONSpy = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("GeneralEducationSearch.GEArea-option-A1"),
      ).toBeInTheDocument();
    });

    const selectGEArea = screen.getByLabelText("GE Area");
    expect(selectGEArea.value).toBe("A1");

    await userEvent.selectOptions(selectGEArea, "A2");

    expect(selectGEArea.value).toBe("A2");

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

    expect(fetchJSONSpy).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        geArea: "A2",
      }),
    );
  });
});
