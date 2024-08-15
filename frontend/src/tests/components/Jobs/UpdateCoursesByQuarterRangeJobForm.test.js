import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UpdateCoursesByQuarterRangeJobForm from "main/components/Jobs/UpdateCoursesByQuarterRangeJobForm";
import { QueryClient, QueryClientProvider } from "react-query";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const queryClient = new QueryClient();

describe("UpdateCoursesByQuarterRangeJobForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  it("renders correctly", async () => {
    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
      startQtrYYYYQ: null, // use fallback value
      endQtrYYYYQ: null, // use fallback value
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UpdateCoursesByQuarterRangeJobForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Update Courses/)).toBeInTheDocument();
    expect(
      screen.getByTestId(/UpdateCoursesByQuarterRangeJobForm.IfStale/),
    ).toBeInTheDocument();
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
          <UpdateCoursesByQuarterRangeJobForm />
        </Router>
      </QueryClientProvider>,
    );

    // Make sure the first and last options
    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterRangeJobForm.StartQuarter-option-0/,
      ),
    ).toHaveValue("20211");
    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterRangeJobForm.StartQuarter-option-3/,
      ),
    ).toHaveValue("20214");

    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterRangeJobForm.EndQuarter-option-0/,
      ),
    ).toHaveValue("20211");
    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterRangeJobForm.EndQuarter-option-3/,
      ),
    ).toHaveValue("20214");
  });
});
