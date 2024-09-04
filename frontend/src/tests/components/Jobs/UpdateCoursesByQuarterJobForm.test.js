import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UpdateCoursesByQuarterJobForm from "main/components/Jobs/UpdateCoursesByQuarterJobForm";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const queryClient = new QueryClient();

describe("UpdateCoursesByQuarterJobForm tests", () => {
  const saveProcessEnv = process.env;

  beforeEach(() => {
    process.env = {};
  });
  afterEach(() => {
    process.env = saveProcessEnv;
  });

  it("renders correctly with start and end values", async () => {
    process.env = {
      REACT_APP_START_QTR: "20221",
      REACT_APP_END_QTR: "20224",
    };
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
    ).toHaveValue("20224");
  });
});
