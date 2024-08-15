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

  it("renders loading when startQtrYYYYQ and endQtrYYYYQ are not available", async () => {
    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
      startQtrYYYYQ: null, // they will be initially
      endQtrYYYYQ: null // they will be initially
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UpdateCoursesByQuarterRangeJobForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Loading.../)).toBeInTheDocument();
  });

  test("renders correctly for a reasonable range", async () => {
    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
      startQtrYYYYQ: 20204, // use fallback value
      endQtrYYYYQ: 20213, // use fallback value
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
    ).toHaveValue("20204");
    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterRangeJobForm.StartQuarter-option-3/,
      ),
    ).toHaveValue("20213");
  });
});
