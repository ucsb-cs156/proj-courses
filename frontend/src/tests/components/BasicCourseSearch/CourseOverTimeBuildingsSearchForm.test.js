import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CourseOverTimeBuildingsSearchForm from "main/components/BasicCourseSearch/CourseOverTimeBuildingsSearchForm";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("CourseOverTimeBuildingsSearchForm tests", () => {
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
      QtrYYYQ: "20201",
    });
    axiosMock.onGet("/api/public/basicQuarterDates").reply(200, [
      { yyyyq: "20201" },
      { yyyyq: "20211" },
      { yyyyq: "20222" },
    ]);

    toast.mockReturnValue({
      addToast: addToast,
    });
  });

  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("when I select a quarter, the state for quarter changes", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20201");
    expect(selectQuarter.value).toBe("20201");
  });

  test("when I select a building, the state for building changes", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "CourseOverTimeBuildingsSearch.BuildingCode-option-0";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectBuilding = screen.getByLabelText("Building Name");
    userEvent.selectOptions(selectBuilding, "BRDA");

    expect(selectBuilding.value).toBe("BRDA");
  });

  test("when I click submit, the right stuff happens", async () => {
    const sampleReturnValue = {
      sampleKey: "sampleValue",
    };

    const fetchJSONSpy = jest.fn();

    fetchJSONSpy.mockResolvedValue(sampleReturnValue);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedFields = {
      Quarter: "20201",
      buildingCode: "GIRV",
    };

    const expectedKey = "CourseOverTimeBuildingsSearch.BuildingCode-option-0";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20201");
    const selectBuilding = screen.getByLabelText("Building Name");
    expect(selectBuilding).toBeInTheDocument();
    userEvent.selectOptions(selectBuilding, "GIRV");
    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

    expect(fetchJSONSpy).toHaveBeenCalledWith(
      expect.any(Object),
      expectedFields,
    );
  });

  test("renders without crashing when fallback values are used", async () => {
    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: true,
      showSwaggerUILink: true,
      QtrYYYYQ: null, // use fallback value
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Make sure the first and last options
    expect(
      await screen.findByTestId(
        "CourseOverTimeBuildingsSearch.Quarter-option-0",
      ),
    ).toHaveValue("20201");
    expect(
      await screen.findByTestId(
        "CourseOverTimeBuildingsSearch.BuildingCode-option-0",
      ),
    ).toHaveValue("");
    expect(
      await screen.findByTestId(
        "CourseOverTimeBuildingsSearch.BuildingCode-option-3",
      ),
    ).toHaveValue("BRDA");
  });

  test("Button padding is correct", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const submitButton = screen.getByText("Submit");
    const buttonCol = submitButton.parentElement;
    const buttonRow = buttonCol.parentElement;
    expect(buttonRow).toHaveAttribute(
      "style",
      "padding-top: 10px; padding-bottom: 10px;",
    );
  });

  test("fetches classrooms and displays them when quarter and building are selected", async () => {
    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classroom", {
        params: { quarter: "20201", buildingCode: "GIRV" },
      })
      .reply(200, ["1431", "1435"]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20201");

    const selectBuilding = screen.getByLabelText("Building Name");

    const expectedKey = "CourseOverTimeBuildingsSearch.BuildingCode-option-0";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey)).toBeInTheDocument(),
    );

    await userEvent.selectOptions(selectBuilding, "GIRV");

    // Wait for classroom API to be called and classrooms displayed
    await waitFor(() =>
      expect(screen.getByTestId("available-classrooms")).toBeInTheDocument(),
    );

    expect(screen.getByTestId("available-classrooms")).toHaveTextContent(
      "1431, 1435",
    );
  });
});
