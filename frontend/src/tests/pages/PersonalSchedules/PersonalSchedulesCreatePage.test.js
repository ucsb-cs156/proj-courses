import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PersonalSchedulesCreatePage from "main/pages/PersonalSchedules/PersonalSchedulesCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("PersonalSchedulesCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const saveProcessEnv = process.env;

  beforeEach(() => {
    process.env = {};
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  afterEach(() => {
    process.env = saveProcessEnv;
  });

  test("renders without crashing", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(
      screen.getByText("Create New Personal Schedule"),
    ).toBeInTheDocument();
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    process.env = { REACT_APP_START_QTR: "20121", REACT_APP_END_QTR: "20134" };
    const queryClient = new QueryClient();
    const personalSchedule = {
      id: 17,
      name: "SampName",
      description: "desc",
      quarter: "W08",
    };
    axiosMock
      .onPost("/api/personalschedules/post")
      .reply(202, personalSchedule);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId("PersonalScheduleForm-name"),
    ).toBeInTheDocument();

    const nameField = screen.getByTestId("PersonalScheduleForm-name");
    const descriptionField = screen.getByTestId(
      "PersonalScheduleForm-description",
    );
    const quarterField = document.querySelector(
      "#PersonalScheduleForm-quarter",
    );
    const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

    fireEvent.change(nameField, { target: { value: "SampName" } });
    fireEvent.change(descriptionField, { target: { value: "desc" } });
    fireEvent.change(quarterField, { target: { value: "20124" } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(quarterField).toHaveValue("20124");

    expect(axiosMock.history.post[0].params).toEqual({
      name: "SampName",
      description: "desc",
      quarter: "20124",
    });

    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/personalschedules/list",
    });
  });

  test("when the backend returns an error, user gets toast with error message", async () => {
    const restoreConsole = mockConsole();

    const queryClient = new QueryClient();
    axiosMock
      .onPost("/api/personalschedules/post")
      .reply(500, { message: "The backend is in a mood today" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId("PersonalScheduleForm-name"),
    ).toBeInTheDocument();

    const nameField = screen.getByTestId("PersonalScheduleForm-name");
    const descriptionField = screen.getByTestId(
      "PersonalScheduleForm-description",
    );
    const quarterField = document.querySelector(
      "#PersonalScheduleForm-quarter",
    );
    const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

    fireEvent.change(nameField, { target: { value: "SampName" } });
    fireEvent.change(descriptionField, { target: { value: "desc" } });
    fireEvent.change(quarterField, { target: { value: "20124" } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(mockToast).toHaveBeenCalledWith(
      "Error: The backend is in a mood today",
    );
    restoreConsole();
  });

  test("filling the form with a duplicate personal schedule returns an error", async () => {
    const queryClient = new QueryClient();
    const error = {
      message:
        "A personal schedule with that name already exists in that quarter",
    };

    axiosMock.onPost("/api/personalschedules/post").reply(404, error);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PersonalSchedulesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId("PersonalScheduleForm-name"),
    ).toBeInTheDocument();

    const nameField = screen.getByTestId("PersonalScheduleForm-name");
    const descriptionField = screen.getByTestId(
      "PersonalScheduleForm-description",
    );
    const quarterField = document.querySelector(
      "#PersonalScheduleForm-quarter",
    );
    const submitButton = screen.getByTestId("PersonalScheduleForm-submit");

    fireEvent.change(nameField, { target: { value: "Duplicate" } });
    fireEvent.change(descriptionField, { target: { value: "dupe" } });
    fireEvent.change(quarterField, { target: { value: "20124" } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
  });
});
