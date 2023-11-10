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

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("CourseOverTimeBuildingsIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
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

    const selectStartQuarter = screen.getByLabelText("Start Quarter");
    userEvent.selectOptions(selectStartQuarter, "20222");
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20222");
    const selectBuilding = screen.getByLabelText("Building Name");

    const expectedKey = "CourseOverTimeBuildingsSearch.BuildingCode-option-0";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    userEvent.selectOptions(selectBuilding, "GIRV");

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    axiosMock.resetHistory();

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    expect(axiosMock.history.get[0].params).toEqual({
      startQtr: "20222",
      endQtr: "20222",
      buildingCode: "GIRV",
    });

    expect(screen.getByText("CHEM 184")).toBeInTheDocument();
  });
});
