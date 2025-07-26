import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CourseOverTimeBuildingsSearchForm from "main/components/BasicCourseSearch/CourseOverTimeBuildingsSearchForm";

import { useSystemInfo } from "main/utils/systemInfo";

jest.mock("main/utils/systemInfo", () => ({
  useSystemInfo: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("CourseOverTimeBuildingsSearchForm tests", () => {
  const mockFn = jest.fn();
  const axiosMock = new AxiosMockAdapter(axios);

  const queryClient = new QueryClient();
  const addToast = jest.fn();

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);

    useSystemInfo.mockReturnValue({
      data: {
        startQtrYYYYQ: "20232",
        endQtrYYYYQ: "20254",
      },
    });

    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
      startQtrYYYYQ: "20232",
      endQtrYYYYQ: "20254",
    });
    axiosMock
      .onGet("/api/public/basicQuarterDates")
      .reply(200, [{ yyyyq: "20232" }, { yyyyq: "20242" }, { yyyyq: "20252" }]);

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
    userEvent.selectOptions(selectQuarter, "20232");
    expect(selectQuarter.value).toBe("20232");
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
    await screen.findByTestId(expectedKey);

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
      Quarter: "20232",
      buildingCode: "GIRV",
      classroom: "",
    };

    const expectedKey = "CourseOverTimeBuildingsSearch.BuildingCode-option-0";
    await screen.findByTestId(expectedKey);

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20232");
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
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
      quarterYYYYQ: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId(
        "CourseOverTimeBuildingsSearch.Quarter-option-0",
      ),
    ).toHaveValue("20232");
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
      .onGet("/api/public/courseovertime/buildingsearch/classrooms", {
        params: { quarter: "20232", buildingCode: "GIRV" },
      })
      .reply(200, [
        "1004",
        "1106",
        "1108",
        "1112",
        "1115",
        "1116",
        "1119",
        "2108",
        "2110",
        "2112",
        "2115",
        "2116",
        "2119",
        "2120",
        "2123",
        "2124",
        "2127",
        "2128",
        "2129",
        "2135",
      ]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20232");

    const selectBuilding = screen.getByLabelText("Building Name");

    const expectedKey = "CourseOverTimeBuildingsSearch.BuildingCode-option-0";
    await screen.findByTestId(expectedKey);

    userEvent.selectOptions(selectBuilding, "GIRV");

    await screen.findByTestId("available-classrooms");

    expect(screen.getByTestId("available-classrooms")).toHaveTextContent(
      "1004, 1106, 1108, 1112, 1115, 1116, 1119, 2108, 2110, 2112, 2115, 2116, 2119, 2120, 2123, 2124, 2127, 2128, 2129, 2135",
    );
  });

  test("renders nothing when classrooms is empty", () => {
    render(<CourseOverTimeBuildingsSearchForm fetchJSON={mockFn} />);
    expect(
      screen.queryByTestId("available-classrooms"),
    ).not.toBeInTheDocument();
  });

  test("fetches classrooms and displays them in sorted order", async () => {
    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms", {
        params: { quarter: "20232", buildingCode: "GIRV" },
      })
      .reply(200, ["1108", "1004", "1106"]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    userEvent.selectOptions(screen.getByLabelText("Quarter"), "20232");

    const expectedKey = "CourseOverTimeBuildingsSearch.BuildingCode-option-0";
    await screen.findByTestId(expectedKey);

    userEvent.selectOptions(screen.getByLabelText("Building Name"), "GIRV");

    await screen.findByTestId("available-classrooms");

    expect(screen.getByTestId("available-classrooms")).toHaveTextContent(
      "1004, 1106, 1108",
    );
  });

  test("displays no classrooms and logs error when fetch fails", async () => {
    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms", {
        params: { quarter: "20232", buildingCode: "GIRV" },
      })
      .networkError();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    userEvent.selectOptions(screen.getByLabelText("Quarter"), "20232");

    const expectedKey = "CourseOverTimeBuildingsSearch.BuildingCode-option-0";
    await screen.findByTestId(expectedKey);

    userEvent.selectOptions(screen.getByLabelText("Building Name"), "GIRV");

    await waitFor(() => expect(console.error).toHaveBeenCalled());
    expect(
      screen.queryByTestId("available-classrooms"),
    ).not.toBeInTheDocument();
  });

  test("uses fallback quarter/building when localStorage for quarter/building is null", () => {
    useSystemInfo.mockReturnValue({
      data: { startQtrYYYYQ: "20222", endQtrYYYYQ: "20232" },
    });
    localStorage.removeItem("CourseOverTimeBuildingsSearch.Quarter");
    localStorage.setItem("CourseOverTimeBuildingsSearch.BuildingCode", null);
    render(<CourseOverTimeBuildingsSearchForm fetchJSON={jest.fn()} />);
    expect(screen.getByLabelText("Quarter")).toBeInTheDocument();
    expect(screen.getByLabelText("Building Name")).toBeInTheDocument();
  });

  test("does not fetch classrooms if Quarter or buildingCode is missing", async () => {
    useSystemInfo.mockReturnValue({ data: {} });
    const getSpy = jest.spyOn(axios, "get");

    render(<CourseOverTimeBuildingsSearchForm fetchJSON={jest.fn()} />);
    await waitFor(() => expect(getSpy).not.toHaveBeenCalled());

    localStorage.removeItem("CourseOverTimeBuildingsSearch.Quarter");
    localStorage.removeItem("CourseOverTimeBuildingsSearch.BuildingCode");
    render(<CourseOverTimeBuildingsSearchForm fetchJSON={jest.fn()} />);
    await waitFor(() => expect(getSpy).not.toHaveBeenCalled());
  });

  test("fetches classrooms if both Quarter and buildingCode exist", async () => {
    useSystemInfo.mockReturnValue({ data: {} });
    localStorage.setItem("CourseOverTimeBuildingsSearch.Quarter", "20222");
    localStorage.setItem("CourseOverTimeBuildingsSearch.BuildingCode", "PHELP");
    axios.get.mockResolvedValue({ data: ["CLSS1", "CLSS2"] });
    render(<CourseOverTimeBuildingsSearchForm fetchJSON={jest.fn()} />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });

  test("handles error when classroom fetch fails", async () => {
    useSystemInfo.mockReturnValue({ data: {} });
    localStorage.setItem("CourseOverTimeBuildingsSearch.Quarter", "20222");
    localStorage.setItem("CourseOverTimeBuildingsSearch.BuildingCode", "PHELP");

    const error = new Error("Network error");
    axios.get.mockRejectedValue(error);

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<CourseOverTimeBuildingsSearchForm fetchJSON={jest.fn()} />);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith("Error fetching classrooms", error);
    });

    errorSpy.mockRestore();
  });

  test("logs classrooms when fetch is successful", async () => {
    useSystemInfo.mockReturnValue({ data: {} });
    localStorage.setItem("CourseOverTimeBuildingsSearch.Quarter", "20222");
    localStorage.setItem("CourseOverTimeBuildingsSearch.BuildingCode", "PHELP");
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    axios.get.mockResolvedValue({ data: ["CLSS1"] });
    render(<CourseOverTimeBuildingsSearchForm fetchJSON={jest.fn()} />);
    await waitFor(() =>
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Fetching classrooms with:"),
        { Quarter: "20222", buildingCode: "PHELP" },
      ),
    );
    await waitFor(() =>
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Classrooms returned:"),
        expect.any(Array),
      ),
    );
    logSpy.mockRestore();
  });

  test("sorts classroom list alphabetically", async () => {
    useSystemInfo.mockReturnValue({ data: {} });
    localStorage.setItem("CourseOverTimeBuildingsSearch.Quarter", "20222");
    localStorage.setItem("CourseOverTimeBuildingsSearch.BuildingCode", "PHELP");
    axios.get.mockResolvedValue({ data: ["Z101", "A202", "M303"] });
    render(<CourseOverTimeBuildingsSearchForm fetchJSON={jest.fn()} />);
    await waitFor(() =>
      expect(screen.getByTestId("available-classrooms")).toHaveTextContent(
        "A202, M303, Z101",
      ),
    );
  });

  test("uses first available quarter if localQuarter is falsy", () => {
    localStorage.removeItem("CourseOverTimeBuildingsSearch.Quarter");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm fetchJSON={jest.fn()} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    expect(selectQuarter.value).toBe("20232");
  });

  test("falls back to default endQtr when systemInfo is undefined", () => {
    useSystemInfo.mockReturnValue({ data: undefined });

    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm fetchJSON={jest.fn()} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByLabelText("Quarter")).toBeInTheDocument();
  });
});
