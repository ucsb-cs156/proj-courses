import { vi } from "vitest";
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

vi.mock("main/utils/systemInfo", () => ({
  useSystemInfo: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

describe("CourseOverTimeBuildingsSearchForm tests", () => {
  const mockFn = vi.fn();
  const axiosMock = new AxiosMockAdapter(axios);

  const queryClient = new QueryClient();
  const addToast = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    vi.spyOn(console, "error");
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
    await userEvent.selectOptions(selectBuilding, "BRDA");

    expect(selectBuilding.value).toBe("BRDA");
  });

  test("when I click submit, the right stuff happens", async () => {
    const sampleReturnValue = {
      sampleKey: "sampleValue",
    };

    const fetchJSONSpy = vi.fn();

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
      classroom: "ALL",
    };

    const expectedKey = "CourseOverTimeBuildingsSearch.BuildingCode-option-0";
    await screen.findByTestId(expectedKey);

    const selectQuarter = screen.getByLabelText("Quarter");
    await userEvent.selectOptions(selectQuarter, "20232");
    const selectBuilding = screen.getByLabelText("Building Name");
    expect(selectBuilding).toBeInTheDocument();
    await userEvent.selectOptions(selectBuilding, "GIRV");
    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

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
    await userEvent.selectOptions(selectQuarter, "20232");

    const selectBuilding = screen.getByLabelText("Building Name");

    const expectedKey = "CourseOverTimeBuildingsSearch.BuildingCode-option-0";
    await screen.findByTestId(expectedKey);

    await userEvent.selectOptions(selectBuilding, "GIRV");

    const classroomSelect = await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.ClassroomSelect",
    );

    const optionTexts = Array.from(classroomSelect.options).map(
      (opt) => opt.textContent,
    );

    expect(optionTexts[0]).toBe("ALL");
    expect(optionTexts.slice(1)).toEqual([
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
    expect(classroomSelect.value).toBe("ALL");
  });

  test("renders nothing when classrooms is empty", () => {
    render(<CourseOverTimeBuildingsSearchForm fetchJSON={mockFn} />);
    const classroomSelect = screen.getByTestId(
      "CourseOverTimeBuildingsSearch.ClassroomSelect",
    );
    expect(classroomSelect).toBeInTheDocument();
    expect(classroomSelect).toBeDisabled();
    expect(classroomSelect.options).toHaveLength(1);
    expect(classroomSelect.options[0].textContent).toBe("ALL");
  });

  test("displays no classrooms and logs error when fetch fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
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

    await userEvent.selectOptions(screen.getByLabelText("Quarter"), "20232");

    const expectedKey = "CourseOverTimeBuildingsSearch.BuildingCode-option-0";
    await screen.findByTestId(expectedKey);

    await userEvent.selectOptions(
      screen.getByLabelText("Building Name"),
      "GIRV",
    );

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
      const [msg, err] = errorSpy.mock.calls[0];
      expect(msg).toBe("Error fetching classrooms");
      expect(err).toBeInstanceOf(Error);
    });

    const classroomSelect = screen.getByTestId(
      "CourseOverTimeBuildingsSearch.ClassroomSelect",
    );
    expect(classroomSelect).toBeDisabled();
    expect(classroomSelect.options).toHaveLength(1);
    expect(classroomSelect.options[0].textContent).toBe("ALL");
  });

  test("uses fallback quarter/building when localStorage for quarter/building is null", () => {
    useSystemInfo.mockReturnValue({
      data: { startQtrYYYYQ: "20222", endQtrYYYYQ: "20232" },
    });
    localStorage.removeItem("CourseOverTimeBuildingsSearch.Quarter");
    localStorage.setItem("CourseOverTimeBuildingsSearch.BuildingCode", null);
    render(<CourseOverTimeBuildingsSearchForm fetchJSON={vi.fn()} />);
    expect(screen.getByLabelText("Quarter")).toBeInTheDocument();
    expect(screen.getByLabelText("Building Name")).toBeInTheDocument();
  });

  test("does not fetch classrooms if Quarter or buildingCode is missing", async () => {
    useSystemInfo.mockReturnValue({ data: {} });
    const getSpy = vi.spyOn(axios, "get");

    render(<CourseOverTimeBuildingsSearchForm fetchJSON={vi.fn()} />);
    await waitFor(() => expect(getSpy).not.toHaveBeenCalled());

    localStorage.removeItem("CourseOverTimeBuildingsSearch.Quarter");
    localStorage.removeItem("CourseOverTimeBuildingsSearch.BuildingCode");
    render(<CourseOverTimeBuildingsSearchForm fetchJSON={vi.fn()} />);
    await waitFor(() => expect(getSpy).not.toHaveBeenCalled());
  });

  test("fetches classrooms if both Quarter and buildingCode exist", async () => {
    useSystemInfo.mockReturnValue({ data: {} });
    localStorage.setItem("CourseOverTimeBuildingsSearch.Quarter", "20222");
    localStorage.setItem("CourseOverTimeBuildingsSearch.BuildingCode", "PHELP");

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms", {
        params: { quarter: "20222", buildingCode: "PHELP" },
      })
      .reply(200, ["CLSS1", "CLSS2"]);

    render(<CourseOverTimeBuildingsSearchForm fetchJSON={vi.fn()} />);

    await waitFor(() => {
      const calls = axiosMock.history.get.filter(
        (c) => c.url === "/api/public/courseovertime/buildingsearch/classrooms",
      );
      expect(calls.length).toBeGreaterThanOrEqual(1);
    });
  });

  test("handles error when classroom fetch fails", async () => {
    useSystemInfo.mockReturnValue({ data: {} });
    localStorage.setItem("CourseOverTimeBuildingsSearch.Quarter", "20222");
    localStorage.setItem("CourseOverTimeBuildingsSearch.BuildingCode", "PHELP");

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms", {
        params: { quarter: "20222", buildingCode: "PHELP" },
      })
      .networkError();

    render(<CourseOverTimeBuildingsSearchForm fetchJSON={vi.fn()} />);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
      const [msg, err] = errorSpy.mock.calls[0];
      expect(msg).toBe("Error fetching classrooms");
      expect(err).toBeInstanceOf(Error);
    });

    errorSpy.mockRestore();
  });

  test("logs classrooms when fetch is successful", async () => {
    useSystemInfo.mockReturnValue({ data: {} });
    localStorage.setItem("CourseOverTimeBuildingsSearch.Quarter", "20222");
    localStorage.setItem("CourseOverTimeBuildingsSearch.BuildingCode", "PHELP");
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms", {
        params: { quarter: "20222", buildingCode: "PHELP" },
      })
      .reply(200, ["CLSS1"]);

    render(<CourseOverTimeBuildingsSearchForm fetchJSON={vi.fn()} />);

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

  test("uses first available quarter if localQuarter is falsy", () => {
    localStorage.removeItem("CourseOverTimeBuildingsSearch.Quarter");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm fetchJSON={vi.fn()} />
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
          <CourseOverTimeBuildingsSearchForm fetchJSON={vi.fn()} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByLabelText("Quarter")).toBeInTheDocument();
  });

  test("when I select a specific classroom, it is sent to fetchJSON on submit", async () => {
    // mock classrooms API
    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms", {
        params: { quarter: "20232", buildingCode: "GIRV" },
      })
      .reply(200, ["1108", "1004", "1106"]); // unsorted on purpose

    const fetchJSONSpy = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await userEvent.selectOptions(screen.getByLabelText("Quarter"), "20232");

    const expectedKey = "CourseOverTimeBuildingsSearch.BuildingCode-option-0";
    await screen.findByTestId(expectedKey);

    await userEvent.selectOptions(
      screen.getByLabelText("Building Name"),
      "GIRV",
    );

    const classroomSelect = await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.ClassroomSelect",
    );

    await waitFor(() => {
      const values = Array.from(classroomSelect.options).map(
        (opt) => opt.value,
      );
      expect(values).toContain("1106");
    });

    // Now it's safe to select it
    await userEvent.selectOptions(classroomSelect, "1106");
    expect(classroomSelect.value).toBe("1106");

    // Submit
    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

    expect(fetchJSONSpy).toHaveBeenCalledWith(expect.any(Object), {
      Quarter: "20232",
      buildingCode: "GIRV",
      classroom: "1106",
    });
  });

  test("Classroom row has correct top padding", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm fetchJSON={vi.fn()} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const classroomLabel = screen.getByLabelText("Classroom");
    const classroomRow = classroomLabel.closest(".row");
    expect(classroomRow).not.toBeNull();
    expect(classroomRow).toHaveAttribute("style", "padding-top: 10px;");
  });

  test("does not fetch classrooms when only Quarter is set but buildingCode is missing", async () => {
    // Make systemInfo not provide any defaults that force buildingCode
    useSystemInfo.mockReturnValue({ data: {} });

    const getSpy = vi.spyOn(axios, "get");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm fetchJSON={vi.fn()} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await userEvent.selectOptions(screen.getByLabelText("Quarter"), "20232");

    await waitFor(() => {
      const classroomsCalls = getSpy.mock.calls.filter(
        ([url]) =>
          url === "/api/public/courseovertime/buildingsearch/classrooms",
      );
      expect(classroomsCalls.length).toBe(0);
    });

    getSpy.mockRestore();
  });

  test("sets classroom to ALL after fetching classrooms successfully", async () => {
    const fetchJSONMock = vi.fn();
    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms")
      .reply(200, ["1312", "2020", "1108"]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm fetchJSON={fetchJSONMock} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    const selectBuilding = screen.getByLabelText("Building Name");

    await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.BuildingCode-option-0",
    );

    await userEvent.selectOptions(selectQuarter, "20232");

    await userEvent.selectOptions(selectBuilding, "GIRV");

    const classroomSelect = screen.getByTestId(
      "CourseOverTimeBuildingsSearch.ClassroomSelect",
    );

    await waitFor(() => {
      const options = Array.from(classroomSelect.options).map(
        (opt) => opt.value,
      );
      expect(options).toContain("1312");
    });

    expect(classroomSelect.value).toBe("ALL");

    // Verify ALL option exists
    const allOption = screen.getByRole("option", { name: "ALL" });
    expect(allOption.selected).toBe(true);
  });

  test("resets classroom to ALL when building changes and new classrooms are fetched", async () => {
    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms", {
        params: { quarter: "20232", buildingCode: "GIRV" },
      })
      .replyOnce(200, ["1004", "1106", "1108"]);

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms", {
        params: { quarter: "20232", buildingCode: "BRDA" },
      })
      .replyOnce(200, ["2001", "2002"]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm fetchJSON={vi.fn()} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    const selectBuilding = screen.getByLabelText("Building Name");

    await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.BuildingCode-option-0",
    );

    await userEvent.selectOptions(selectQuarter, "20232");
    await userEvent.selectOptions(selectBuilding, "GIRV");

    const classroomSelect = screen.getByTestId(
      "CourseOverTimeBuildingsSearch.ClassroomSelect",
    );

    await waitFor(() => {
      const options = Array.from(classroomSelect.options).map(
        (opt) => opt.value,
      );
      expect(options).toContain("1106");
    });

    await userEvent.selectOptions(classroomSelect, "1106");
    expect(classroomSelect.value).toBe("1106");

    await userEvent.selectOptions(selectBuilding, "BRDA");

    await waitFor(() => {
      const options = Array.from(classroomSelect.options).map(
        (opt) => opt.value,
      );
      expect(options).toContain("2001");
      expect(options).not.toContain("1106");
    });

    expect(classroomSelect.value).toBe("ALL");

    const allOption = screen.getByRole("option", { name: "ALL" });
    expect(allOption.selected).toBe(true);
  });

  test("actually calls the classrooms API when quarter and building are set", async () => {
    const mockClassrooms = ["1004", "1106", "1108"];

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms")
      .reply(200, mockClassrooms);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsSearchForm fetchJSON={vi.fn()} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.BuildingCode-option-0",
    );

    await userEvent.selectOptions(screen.getByLabelText("Quarter"), "20232");
    await userEvent.selectOptions(
      screen.getByLabelText("Building Name"),
      "GIRV",
    );

    await waitFor(() => {
      const calls = axiosMock.history.get.filter(
        (call) =>
          call.url === "/api/public/courseovertime/buildingsearch/classrooms",
      );
      expect(calls).toHaveLength(1);
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0].params).toEqual({
        quarter: "20232",
        buildingCode: "GIRV",
      });
    });

    const classroomSelect = screen.getByTestId(
      "CourseOverTimeBuildingsSearch.ClassroomSelect",
    );

    await waitFor(() => {
      expect(classroomSelect).not.toBeDisabled();
    });

    await waitFor(() => {
      const options = Array.from(classroomSelect.options).map(
        (opt) => opt.value,
      );
      expect(options).toEqual(["ALL", "1004", "1106", "1108"]);
    });
  });
});
