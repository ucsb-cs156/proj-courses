import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ClearJobsForm from "main/components/Jobs/ClearJobsForm";
import { QueryClient, QueryClientProvider } from "react-query";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const queryClient = new QueryClient();

describe("ClearJobsForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  it("renders correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ClearJobsForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Clear/)).toBeInTheDocument();
  });

  test("renders without crashing when fallback values are used", async () => {
    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ClearJobsForm />
        </Router>
      </QueryClientProvider>,
    );

    // Make sure the first and last options
    expect(await screen.findByTestId("clearJobsSubmit")).toBeInTheDocument();
  });
});
