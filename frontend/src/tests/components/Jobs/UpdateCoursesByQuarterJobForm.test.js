import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UpdateCoursesByQuarterJobForm from "main/components/Jobs/UpdateCoursesByQuarterJobForm";
import { QueryClient, QueryClientProvider } from "react-query";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { useSystemInfo } from "main/utils/systemInfo";
import { use } from "react";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("main/utils/systemInfo", () => ({
  useSystemInfo: jest.fn(),
}));

const queryClient = new QueryClient();

describe("UpdateCoursesByQuarterJobForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.resetAllMocks();
    axiosMock.reset();

    useSystemInfo.mockReturnValue({
      data: {
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: "20211",
        endQtrYYYYQ: "20214",
      },
    });
  });

  it("renders correctly with start and end values from systemInfo", async () => {
    useSystemInfo.mockReturnValue({
      data: {
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: "20201",
        endQtrYYYYQ: "20204",
      },
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
    ).toHaveValue("20201");
    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterJobForm.Quarter-option-3/,
      ),
    ).toHaveValue("20204");
  });

  test("renders without crashing when fallback values are used", async () => {
    useSystemInfo.mockReturnValue({
      data: {
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: null,
        endQtrYYYYQ: null,
      },
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
    ).toHaveValue("20214");

    expect(screen.getByLabelText("Quarter").value).toBe("20211");
  });

  test("works when local storage has a value", async () => {
    useSystemInfo.mockReturnValue({
      data: {
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: "20191",
        endQtrYYYYQ: "20194",
      },
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
    ).toHaveValue("20191");
    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterJobForm.Quarter-option-3/,
      ),
    ).toHaveValue("20194");

    // Assert: make sure option from local storage is selected
    expect(screen.getByLabelText("Quarter").value).toBe("20193");
  });

  test("works when local storage doesn't have a value", async () => {
    useSystemInfo.mockReturnValue({
      data: {
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: "20231",
        endQtrYYYYQ: "20234",
      },
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
    ).toHaveValue("20231");

    expect(
      await screen.findByTestId(
        /UpdateCoursesByQuarterJobForm.Quarter-option-3/,
      ),
    ).toHaveValue("20234");

    expect(getItemSpy).toHaveBeenCalledWith(
      "UpdateCoursesByQuarterJobForm.Quarter",
    );
    expect(screen.getByLabelText("Quarter").value).toBe("20231");
  });
});
