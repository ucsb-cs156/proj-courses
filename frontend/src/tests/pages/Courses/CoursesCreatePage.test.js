import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CoursesCreatePage from "main/pages/Courses/PSCourseCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

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

describe("CoursesCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const courses = [
      {
        id: "17",
        psId: 13,
        enrollCd: "08250",
      },
    ];

    axiosMock.onPost("/api/courses/post").reply(202, courses);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId("CourseForm-enrollCd"),
    ).toBeInTheDocument();

    const enrollCdField = screen.getByTestId("CourseForm-enrollCd");
    const psIdField = document.querySelector("#CourseForm-psId");
    const submitButton = screen.getByTestId("CourseForm-submit");

    fireEvent.change(psIdField, { target: { value: 13 } });
    localStorage.setItem("CourseForm-psId", "13");
    fireEvent.change(enrollCdField, { target: { value: "08250" } });
    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    // expect(quarterField).toHaveValue("20124");
    //expect(setQuarter).toBeCalledWith("20124"); //need this and axiosMock below?
    expect(localStorage.getItem("CourseForm-psId")).toBe("13");
    expect(axiosMock.history.post[0].params).toEqual({
      psId: "13",
      enrollCd: "08250",
    });

    expect(mockToast).toBeCalledWith(
      "New course Created - id: 17 enrollCd: 08250",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/courses/list" });
  });

  test("404", async () => {
    const queryClient = new QueryClient();

    axiosMock.onPost("/api/courses/post").reply(404, {
      status: 404,
      message: "PersonalSchedule with id 3000 not found",
      type: "EntityNotFoundException",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const enrollCdField = await screen.findByTestId("CourseForm-enrollCd");
    const submitButton = screen.getByTestId("CourseForm-submit");

    fireEvent.change(enrollCdField, { target: { value: "11111" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("PSCourseCreate-Error")).toHaveTextContent(
        "Error: Personal schedule not found. Please create a new personal schedule first.",
      );
    });
  });

  test("400", async () => {
    const queryClient = new QueryClient();

    axiosMock.onPost("/api/courses/post").reply(400);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const enrollCdField = await screen.findByTestId("CourseForm-enrollCd");
    const submitButton = screen.getByTestId("CourseForm-submit");

    fireEvent.change(enrollCdField, { target: { value: "11111" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("PSCourseCreate-Error")).toHaveTextContent(
        "Error: Personal schedule not found. Please create a new personal schedule first.",
      );
    });
  });

  test("we display the correct error message", async () => {
    const queryClient = new QueryClient();

    axiosMock.onPost("/api/courses/post").reply(404, {
      status: 404,
      message: "haahaha",
      type: "EntityNotFoundException",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const enrollCdField = await screen.findByTestId("CourseForm-enrollCd");
    const submitButton = screen.getByTestId("CourseForm-submit");

    fireEvent.change(enrollCdField, { target: { value: "11111" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("PSCourseCreate-Error")).toHaveTextContent(
        "Error: haahaha",
      );
    });
  });

  test("when you input incorrect information, we get an error", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByTestId("CourseForm-psId")).toBeInTheDocument();

    const psIdField = document.querySelector("#CourseForm-psId");
    const enrollCdField = screen.getByTestId("CourseForm-enrollCd");
    const submitButton = screen.getByTestId("CourseForm-submit");

    fireEvent.change(psIdField, { target: { value: 13 } });
    fireEvent.change(enrollCdField, { target: { value: "99881" } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await screen.findByTestId("PSCourseCreate-Error");
    const PSError = screen.getByTestId("PSCourseCreate-Error");
    expect(PSError).toBeInTheDocument();
    expect(screen.getByTestId("PSCourseCreate-Error")).not.toHaveTextContent(
      "Error: Personal schedule not found. Please create a new personal schedule first.",
    );
  });

  test("sets schedule and updates localStorage when schedules are available", async () => {
    console.log("Inside Last Test");
    const queryClient = new QueryClient();

    axiosMock.onGet("/api/personalschedules/all").reply(200, [
      {
        id: 17,
        name: "SampName",
        description: "desc",
        quarter: "W08",
      },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CoursesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByTestId("CourseForm-enrollCd"),
    ).toBeInTheDocument();
    expect(localStorage.getItem("CourseForm-psId")).toBe("17");
  });
});
