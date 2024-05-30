import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UpdateGradeInfoJobForm from "main/components/Jobs/UpdateGradeInfoJobForm";
import { QueryClient, QueryClientProvider } from "react-query";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const queryClient = new QueryClient();

describe("UpdateGradeInfoJobForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  it("renders correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UpdateGradeInfoJobForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Update Grades/)).toBeInTheDocument();
    const buttonRow = screen.getByTestId("updateGradesRow");
    expect(buttonRow).toHaveAttribute(
      "style",
      "padding-top: 10px; padding-bottom: 10px;",
    );
  });

  test("Blocked callback results throws error", async () => {
    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UpdateGradeInfoJobForm />
        </Router>
      </QueryClientProvider>,
    );
    

  });


});
