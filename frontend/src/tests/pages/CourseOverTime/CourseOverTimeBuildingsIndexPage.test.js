import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CourseOverTimeBuildingsIndexPage from "main/pages/CourseOverTime/CourseOverTimeBuildingsIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import {
  coursesInLib,
  coursesInLibDifferentDate,
} from "fixtures/buildingFixtures";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const original = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...original,
    toast: (msg) => mockToast(msg),
  };
});

const mockForm = jest.fn();
jest.mock(
  "main/components/BasicCourseSearch/CourseOverTimeBuildingsSearchForm",
  () => {
    const Actual = jest.requireActual(
      "main/components/BasicCourseSearch/CourseOverTimeBuildingsSearchForm",
    ).default;
    return (props) => {
      mockForm(props);
      return <Actual {...props} />;
    };
  },
);

describe("CourseOverTimeBuildingsIndexPage tests", () => {
  let axiosMock;
  const queryClient = new QueryClient();

  beforeEach(() => {
    axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock.onGet("/api/personalschedules/all").reply(200, []);
    mockForm.mockClear();
  });

  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("calls both APIs and passes availableClassrooms to form", async () => {
    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch")
      .reply(200, coursesInLib);
    axiosMock
      .onGet("/api/public/courseovertime/classrooms")
      .reply(200, ["1004", "2110"]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    userEvent.selectOptions(screen.getByLabelText("Start Quarter"), "20222");
    userEvent.selectOptions(screen.getByLabelText("End Quarter"), "20222");
    userEvent.selectOptions(screen.getByLabelText("Building Name"), "GIRV");
    userEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      const calls = axiosMock.history.get
        .map((r) => r.url)
        .filter((u) => u.includes("/courseovertime/"));
      expect(calls).toHaveLength(2);
    });

    const calls = axiosMock.history.get.filter((r) =>
      r.url.includes("/courseovertime/"),
    );

    expect(calls[0].url).toContain("buildingsearch");
    expect(calls[0].params).toEqual({
      startQtr: "20222",
      endQtr: "20222",
      buildingCode: "GIRV",
    });

    expect(calls[1].url).toContain("classrooms");
    expect(calls[1].params).toEqual({
      startQtr: "20222",
      endQtr: "20222",
      buildingCode: "GIRV",
    });

    await waitFor(() =>
      expect(mockForm).toHaveBeenLastCalledWith(
        expect.objectContaining({
          availableClassrooms: ["1004", "2110"],
        }),
      ),
    );

    expect(screen.getByText("CHEM 184")).toBeInTheDocument();
  });

  test("sorted-data test still works", async () => {
    axiosMock
      .onGet("/api/public/courseovertime/buildingsearch")
      .reply(200, coursesInLibDifferentDate);
    axiosMock.onGet("/api/public/courseovertime/classrooms").reply(200, []);

    const spy = jest.spyOn(
      require("main/components/Sections/SectionsTable"),
      "default",
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeBuildingsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    userEvent.selectOptions(screen.getByLabelText("Start Quarter"), "20201");
    userEvent.selectOptions(screen.getByLabelText("End Quarter"), "20222");
    userEvent.selectOptions(screen.getByLabelText("Building Name"), "GIRV");
    userEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      const calls = axiosMock.history.get.filter((r) =>
        r.url.includes("/courseovertime/"),
      );
      expect(calls).toHaveLength(2);
    });

    const sorted = [...coursesInLibDifferentDate].sort((a, b) =>
      b.courseInfo.quarter.localeCompare(a.courseInfo.quarter),
    );
    expect(spy).toHaveBeenCalledWith({ sections: sorted }, expect.any(Object));

    spy.mockRestore();
  });
});
