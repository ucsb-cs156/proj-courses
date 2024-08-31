import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UpdateCoursesByQuarterJobForm from "main/components/Jobs/UpdateCoursesByQuarterJobForm";
import { QueryClient, QueryClientProvider } from "react-query";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// const mockedUseSystemInfo = jest.fn();

// jest.mock("main/utils/systemInfo", () => ({
//   useSystemInfo: () => mockedUseSystemInfo,
// }));

const queryClient = new QueryClient();

describe("UpdateCoursesByQuarterJobForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  it("renders correctly with start and end values from systemInfo", async () => {
    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
      startQtrYYYYQ: "20201", // use fallback value
      endQtrYYYYQ: "20204", // use fallback value
    });
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UpdateCoursesByQuarterJobForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Update Courses/)).toBeInTheDocument();
    // Make sure the first and last options are what we expect
    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterJobForm.Quarter-option-0/,
      ),
    ).toHaveValue("20221");
    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterJobForm.Quarter-option-3/,
      ),
    ).toHaveValue("20204");
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
        <Router>
          <UpdateCoursesByQuarterJobForm />
        </Router>
      </QueryClientProvider>,
    );

    // Make sure the first and last options are what we expect
    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterJobForm.Quarter-option-0/,
      ),
    ).toHaveValue("20201");
    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterJobForm.Quarter-option-3/,
      ),
    ).toHaveValue("20214");
  });

  test("works when local storage has a value", async () => {
    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
      startQtrYYYYQ: "20191", // use fallback value
      endQtrYYYYQ: "20194", // use fallback value
    });
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");

    getItemSpy.mockImplementation((key) => {
      const values = {
        "UpdateCoursesByQuarterJobForm.Quarter": "20193",
      };
      return key in values ? values[key] : null;
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UpdateCoursesByQuarterJobForm />
        </Router>
      </QueryClientProvider>,
    );

    // Make sure the first and last options are what we expect
    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterJobForm.Quarter-option-0/,
      ),
    ).toHaveValue("20211");
    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterJobForm.Quarter-option-3/,
      ),
    ).toHaveValue("20194");

    // Assert: make sure option from local storage is selected
    expect(screen.getByRole("option", { name: /M19/i }).selected).toBeTruthy();
  });

  test("works when local storage doesn't have a value", async () => {
    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
      startQtrYYYYQ: "20181", // use fallback value
      endQtrYYYYQ: "20184", // use fallback value
    });

    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation((key) => {
      const values = {};
      return key in values ? values[key] : null;
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UpdateCoursesByQuarterJobForm />
        </Router>
      </QueryClientProvider>,
    );

    // Make sure the first and last options are what we expect
    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterJobForm.Quarter-option-0/,
      ),
    ).toHaveValue("20191");

    expect(getItemSpy).toHaveBeenCalledWith(
      "UpdateCoursesByQuarterJobForm.Quarter",
    );

    expect(screen.queryByRole("option", { name: /W19/i }).selected).toBeFalsy();
    expect(screen.queryByRole("option", { name: /S19/i }).selected).toBeFalsy();
    expect(screen.queryByRole("option", { name: /M19/i }).selected).toBeFalsy();
    expect(screen.getByRole("option", { name: /F19/i }).selected).toBeTruthy();
  });
});
