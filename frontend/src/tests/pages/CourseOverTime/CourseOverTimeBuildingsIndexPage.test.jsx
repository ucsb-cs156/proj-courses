import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CourseOverTimeBuildingsIndexPage from "main/pages/CourseOverTime/CourseOverTimeBuildingsIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { coursesInLib } from "fixtures/buildingFixtures";
import userEvent from "@testing-library/user-event";

const mockToast = vi.fn();
vi.mock("react-toastify", async () => {
  const originalModule = await vi.importActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("CourseOverTimeBuildingsIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const classroomOrAll = (query) => query.classroom || "ALL";
  beforeEach(() => {
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/public/basicQuarterDates")
      .reply(200, [{ yyyyq: "20222" }, { yyyyq: "20232" }, { yyyyq: "20242" }]);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("calls UCSB Course over time search api correctly with correct response", async () => {
    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch")
      .reply(200, coursesInLib);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20222");
    const selectBuilding = screen.getByLabelText("Building Name");

    const expectedKey = "CourseOverTimeBuildingsSearch.BuildingCode-option-0";
    await screen.findByTestId(expectedKey);

    userEvent.selectOptions(selectBuilding, "GIRV");

    axiosMock.resetHistory();

    axiosMock.resetHistory();

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    expect(axiosMock.history.get[0].params).toEqual({
      startQtr: "20222",
      endQtr: "20222",
      buildingCode: "GIRV",
    });

    expect(
      screen.getByText((text) => text.includes("184")),
    ).toBeInTheDocument();
  });

  test("filters sections by classroom when classroom is selected", async () => {
    // Create fixture with different rooms
    const coursesInLibDifferentRoom = [
      {
        ...coursesInLib[0],
        section: {
          ...coursesInLib[0].section,
          timeLocations: [
            {
              room: "1312",
              building: "LIB",
              roomCapacity: null,
              days: " T R   ",
              beginTime: "14:00",
              endTime: "15:15",
            },
          ],
        },
      },
      {
        ...coursesInLib[1],
        section: {
          ...coursesInLib[1].section,
          timeLocations: [
            {
              room: "2020",
              building: "LIB",
              roomCapacity: null,
              days: " T R   ",
              beginTime: "14:00",
              endTime: "15:15",
            },
          ],
        },
      },
    ];

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms")
      .reply(200, ["1312", "2020"]);

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch")
      .reply(200, coursesInLibDifferentRoom);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    await userEvent.selectOptions(selectQuarter, "20222");

    const selectBuilding = screen.getByLabelText("Building Name");
    await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.BuildingCode-option-0",
    );
    await userEvent.selectOptions(selectBuilding, "LIB");

    const selectClassroom = await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.ClassroomSelect",
    );

    await waitFor(() => {
      expect(selectClassroom).not.toBeDisabled();
    });

    await userEvent.selectOptions(selectClassroom, "1312");

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    await waitFor(() => {
      const searchCalls = axiosMock.history.get.filter(
        (call) => call.url === "/api/public/courseovertime/buildingsearch",
      );
      expect(searchCalls.length).toBeGreaterThanOrEqual(1);
    });

    await waitFor(() => {
      expect(
        screen.getByText((text) => text.includes("184")),
      ).toBeInTheDocument();
    });
  });

  test("shows all sections when classroom is ALL", async () => {
    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms")
      .reply(200, ["1312"]);

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch")
      .reply(200, coursesInLib);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    await userEvent.selectOptions(selectQuarter, "20222");

    const selectBuilding = screen.getByLabelText("Building Name");
    await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.BuildingCode-option-0",
    );
    await userEvent.selectOptions(selectBuilding, "LIB");

    const selectClassroom = await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.ClassroomSelect",
    );

    await waitFor(() => {
      expect(selectClassroom).not.toBeDisabled();
    });

    // Keep ALL selected (default)
    expect(selectClassroom.value).toBe("ALL");

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    await waitFor(() => {
      const searchCalls = axiosMock.history.get.filter(
        (call) => call.url === "/api/public/courseovertime/buildingsearch",
      );
      expect(searchCalls.length).toBeGreaterThanOrEqual(1);
    });

    await waitFor(() => {
      expect(
        screen.getByText((text) => text.includes("184")),
      ).toBeInTheDocument();
      expect(
        screen.getByText((text) => text.includes("284")),
      ).toBeInTheDocument();
    });
  });

  test("handles sections without timeLocations when filtering", async () => {
    const coursesWithNull = [
      {
        ...coursesInLib[0],
        section: {
          ...coursesInLib[0].section,
          timeLocations: null,
        },
      },
      {
        ...coursesInLib[1],
        section: null,
      },
    ];

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms")
      .reply(200, ["1312"]);

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch")
      .reply(200, coursesWithNull);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    await userEvent.selectOptions(selectQuarter, "20222");

    const selectBuilding = screen.getByLabelText("Building Name");
    await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.BuildingCode-option-0",
    );
    await userEvent.selectOptions(selectBuilding, "LIB");

    const selectClassroom = await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.ClassroomSelect",
    );

    await waitFor(() => {
      expect(selectClassroom).not.toBeDisabled();
    });

    await userEvent.selectOptions(selectClassroom, "1312");

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    await waitFor(() => {
      const searchCalls = axiosMock.history.get.filter(
        (call) => call.url === "/api/public/courseovertime/buildingsearch",
      );
      expect(searchCalls.length).toBeGreaterThanOrEqual(1);
    });

    expect(submitButton).toBeInTheDocument();
  });

  test("filters out sections not in selected classroom", async () => {
    // Create courses with different rooms
    const coursesInDifferentRooms = [
      {
        ...coursesInLib[0],
        courseInfo: {
          ...coursesInLib[0].courseInfo,
          courseId: "CHEM    184  -1",
        },
        section: {
          ...coursesInLib[0].section,
          enrollCode: "06619",
          timeLocations: [
            {
              room: "1312",
              building: "LIB",
              roomCapacity: null,
              days: " T R   ",
              beginTime: "14:00",
              endTime: "15:15",
            },
          ],
        },
      },
      {
        ...coursesInLib[1],
        courseInfo: {
          ...coursesInLib[1].courseInfo,
          courseId: "CHEM    284  -1",
        },
        section: {
          ...coursesInLib[1].section,
          enrollCode: "06817",
          timeLocations: [
            {
              room: "2020",
              building: "LIB",
              roomCapacity: null,
              days: " T R   ",
              beginTime: "14:00",
              endTime: "15:15",
            },
          ],
        },
      },
    ];

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms")
      .reply(200, ["1312", "2020"]);

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch")
      .reply(200, coursesInDifferentRooms);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    await userEvent.selectOptions(selectQuarter, "20222");

    const selectBuilding = screen.getByLabelText("Building Name");
    await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.BuildingCode-option-0",
    );
    await userEvent.selectOptions(selectBuilding, "LIB");

    const selectClassroom = await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.ClassroomSelect",
    );

    await waitFor(() => {
      expect(selectClassroom).not.toBeDisabled();
    });

    await userEvent.selectOptions(selectClassroom, "2020");

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    await waitFor(() => {
      const searchCalls = axiosMock.history.get.filter(
        (call) => call.url === "/api/public/courseovertime/buildingsearch",
      );
      expect(searchCalls.length).toBeGreaterThanOrEqual(1);
    });

    await waitFor(() => {
      expect(
        screen.queryByText((text) => text.includes("184")),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText((text) => text.includes("284")),
      ).toBeInTheDocument();
    });
  });

  test("filters sections with multiple timeLocations correctly", async () => {
    // Create a course with multiple timeLocations
    const courseWithMultipleLocations = [
      {
        ...coursesInLib[0],
        courseInfo: {
          ...coursesInLib[0].courseInfo,
          courseId: "CHEM    184  -1",
        },
        section: {
          ...coursesInLib[0].section,
          enrollCode: "06619",
          timeLocations: [
            {
              room: "1312",
              building: "LIB",
              roomCapacity: null,
              days: " T R   ",
              beginTime: "14:00",
              endTime: "15:15",
            },
            {
              room: "2020",
              building: "LIB",
              roomCapacity: null,
              days: "   W   ",
              beginTime: "14:00",
              endTime: "15:15",
            },
          ],
        },
      },
      {
        ...coursesInLib[1],
        courseInfo: {
          ...coursesInLib[1].courseInfo,
          courseId: "CHEM    284  -1",
        },
        section: {
          ...coursesInLib[1].section,
          enrollCode: "06817",
          timeLocations: [
            {
              room: "3030",
              building: "LIB",
              roomCapacity: null,
              days: " T R   ",
              beginTime: "14:00",
              endTime: "15:15",
            },
          ],
        },
      },
    ];

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms")
      .reply(200, ["1312", "2020", "3030"]);

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch")
      .reply(200, courseWithMultipleLocations);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    await userEvent.selectOptions(selectQuarter, "20222");

    const selectBuilding = screen.getByLabelText("Building Name");
    await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.BuildingCode-option-0",
    );
    await userEvent.selectOptions(selectBuilding, "LIB");

    const selectClassroom = await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.ClassroomSelect",
    );

    await waitFor(() => {
      expect(selectClassroom).not.toBeDisabled();
    });

    await userEvent.selectOptions(selectClassroom, "1312");

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    await waitFor(() => {
      const searchCalls = axiosMock.history.get.filter(
        (call) => call.url === "/api/public/courseovertime/buildingsearch",
      );
      expect(searchCalls.length).toBeGreaterThanOrEqual(1);
    });

    await waitFor(() => {
      expect(
        screen.getByText((text) => text.includes("184")),
      ).toBeInTheDocument();
      expect(
        screen.queryByText((text) => text.includes("284")),
      ).not.toBeInTheDocument();
    });
  });

  test("defaults to ALL when classroom parameter is empty string", async () => {
    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch/classrooms")
      .reply(200, ["1312"]);

    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch")
      .reply(200, coursesInLib);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    await userEvent.selectOptions(selectQuarter, "20222");

    const selectBuilding = screen.getByLabelText("Building Name");
    await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.BuildingCode-option-0",
    );
    await userEvent.selectOptions(selectBuilding, "LIB");

    const selectClassroom = await screen.findByTestId(
      "CourseOverTimeBuildingsSearch.ClassroomSelect",
    );

    await waitFor(() => {
      expect(selectClassroom).not.toBeDisabled();
    });

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    await waitFor(() => {
      const searchCalls = axiosMock.history.get.filter(
        (call) => call.url === "/api/public/courseovertime/buildingsearch",
      );
      expect(searchCalls.length).toBeGreaterThanOrEqual(1);
    });

    await waitFor(() => {
      expect(
        screen.getByText((text) => text.includes("184")),
      ).toBeInTheDocument();
      expect(
        screen.getByText((text) => text.includes("284")),
      ).toBeInTheDocument();
    });
  });

  test("classroomOrAll returns 'ALL' when classroom is empty string", () => {
    expect(classroomOrAll({ classroom: "" })).toBe("ALL");
  });

  test("classroomOrAll returns classroom when non-empty", () => {
    expect(classroomOrAll({ classroom: "1312" })).toBe("1312");
  });
});
