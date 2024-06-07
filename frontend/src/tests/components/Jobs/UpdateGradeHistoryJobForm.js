import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UpdateGradeHistoryJobForm from "main/components/Jobs/UpdateGradeHistoryJobForm";
import { QueryClient, QueryClientProvider } from "react-query";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const queryClient = new QueryClient();

describe("UpdateGradeHistoryJobForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  axiosMock.onGet("/api/systemInfo").reply(200, {
    springH2ConsoleEnabled: false,
    showSwaggerUILink: false,
  });

  it("renders correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UpdateGradeHistoryJobForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Update Grade History/)).toBeInTheDocument();
  });
});
