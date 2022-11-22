import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import TestJobsForm from "main/components/Jobs/TestJobForm";
import jobsFixtures from "fixtures/jobsFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("TestJobsForm tests", () => {
  it("renders correctly with the right defaults", async () => {
    render(
      <Router >
        <TestJobsForm />
      </Router>
    );

    expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();
    expect(await screen.findByTestId("TestJobForm-sleepMs")).toBeInTheDocument();
    expect(screen.getByText(/Submit/)).toBeInTheDocument();
  });


  it("has validation errors for required fields", async () => {
    const submitAction = jest.fn();

    render(
      <Router  >
        <TestJobsForm jobs={jobsFixtures.sixJobs}/>
      </Router  >
    );

    expect(await screen.findByTestId("TestJobForm-fail")).toBeInTheDocument();
    const submitButton = screen.getByTestId("TestJobForm-Submit-Button");
    const sleepMs = screen.getByTestId("TestJobForm-sleepMs");

    expect(submitButton).toBeInTheDocument();
    expect(sleepMs).toHaveValue(1000);

    fireEvent.change(sleepMs, { target: { value: '70000' } })
    fireEvent.click(submitButton);
    expect(await screen.findByText(/sleepMs may not be/i)).toBeInTheDocument();
    expect(submitAction).not.toBeCalled();
  });
});
