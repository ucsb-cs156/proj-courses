import {
  queryByPlaceholderText,
  render,
  waitFor,
} from "@testing-library/react";
import HomePage from "main/pages/HomePage";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { allTheSubjects } from "fixtures/subjectFixtures";
import { coursesFixtures } from "fixtures/courseFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("HomePage tests", () => {
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
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  //We have 2 separate tests for this because, we cannot directly test the return value of the backend API without the table
  //This is because the value is returned in the "onSuccess" function in HomePage.js which is an internal part of the function HomePage
  //The next best thing is to Toast the number of courses returned and make sure the number matches up
  test("calls UCSB Curriculum api correctly with 1 course response", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/basicsearch")
      .reply(200, { classes: coursesFixtures.oneCourse });

    const { getByText, getByLabelText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const selectQuarter = getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20211");
    const selectSubject = getByLabelText("Subject Area");
    await waitFor(() => {
      expect(getByLabelText("Subject Area")).toHaveTextContent("ANTH");
    });
    userEvent.selectOptions(selectSubject, "ANTH");
    const selectLevel = getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "G");

    const submitButton = getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    axiosMock.resetHistory();

    await waitFor(() => {
      expect(axiosMock.onGet("/api/public/basicsearch"));
    });

    expect(axiosMock.history.get[0].params).toEqual({
      qtr: "20211",
      dept: "ANTH",
      level: "G",
    });

    expect(mockToast).toHaveBeenCalled();
    //"1 Course" because only oneCourse is the result so the length of the retuened array should be 1
    expect(mockToast).toHaveBeenCalledWith("1 Courses Retrieved");
  });

  test("calls UCSB Curriculum api correctly with 2 course response", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/basicsearch")
      .reply(200, { classes: coursesFixtures.twoCourses });

    const { getByText, getByLabelText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const selectQuarter = getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20211");
    const selectSubject = getByLabelText("Subject Area");
    await waitFor(() => {
      expect(getByLabelText("Subject Area")).toHaveTextContent("ANTH");
    });
    userEvent.selectOptions(selectSubject, "ANTH");
    const selectLevel = getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "G");

    const submitButton = getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    axiosMock.resetHistory();

    await waitFor(() => {
      expect(axiosMock.onGet("/api/public/basicsearch"));
    });

    expect(axiosMock.history.get[0].params).toEqual({
      qtr: "20211",
      dept: "ANTH",
      level: "G",
    });

    expect(mockToast).toHaveBeenCalled();
    //"2 Courses" because twoCourses is the result so the length of the retuened array should be 2
    expect(mockToast).toHaveBeenCalledWith("2 Courses Retrieved");
  });
});
