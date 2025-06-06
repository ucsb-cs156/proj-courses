import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { allTheAreas } from "fixtures/areaFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import GeneralEducationSearchForm from "main/components/GeneralEducation/GeneralEducationSearchForm";

// Mock toast
jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

// Mock useSystemInfo to return a valid quarter range
jest.mock("main/utils/systemInfo", () => ({
  useSystemInfo: () => ({
    data: {
      startQtrYYYYQ: "20221",
      endQtrYYYYQ: "20222",
    },
  }),
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

  test("area and quarter dropdowns are rendered", async () => {
    axiosMock.onGet("/api/public/generalEducationInfo").reply(200, allTheAreas);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const quarterDropdown = await screen.findByLabelText("Quarter");
    expect(quarterDropdown).toBeInTheDocument();

    const areaDropdown = await screen.findByLabelText("General Education Area");
    expect(areaDropdown).toBeInTheDocument();
  });

  test("selecting an area updates the state", async () => {
    axiosMock.onGet("/api/public/generalEducationInfo").reply(200, allTheAreas);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("GeneralEducationSearch.Area-option-C-ENGR"),
      ).toBeInTheDocument();
    });

    const selectArea = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectArea, "C-ENGR");

    expect(selectArea.value).toBe("C-ENGR");
  });

  test("selecting a quarter updates the state", async () => {
    axiosMock.onGet("/api/public/generalEducationInfo").reply(200, allTheAreas);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = await screen.findByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20222");
    expect(selectQuarter.value).toBe("20222");
  });

  test("submitting the form calls fetchJSON with correct area and quarter", async () => {
    axiosMock.onGet("/api/public/generalEducationInfo").reply(200, allTheAreas);
    const fetchJSONSpy = jest.fn().mockResolvedValue({});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("GeneralEducationSearch.Area-option-WRT-L&S"),
      ).toBeInTheDocument();
    });

    const selectArea = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectArea, "WRT-L&S");

    const selectQuarter = await screen.findByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20222");

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

    expect(fetchJSONSpy).toHaveBeenCalledWith(expect.any(Object), {
      area: "WRT-L&S",
      quarter: "20222",
    });
  });

  test("when JSON is empty, setCourse is not called", async () => {
    axiosMock.onGet("/api/public/generalEducationInfo").reply(200, allTheAreas);
    const fetchJSONSpy = jest.fn().mockResolvedValue({
      sampleKey: "sampleValue",
      total: 0,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GeneralEducationSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("GeneralEducationSearch.Area-option-D-L&S"),
      ).toBeInTheDocument();
    });

    const selectArea = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectArea, "D-L&S");

    const selectQuarter = await screen.findByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20221");

    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));
  });
});
