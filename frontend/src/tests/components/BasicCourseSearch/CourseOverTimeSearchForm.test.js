import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { allTheSubjects } from "fixtures/subjectFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CourseOverTimeSearchForm from "main/components/BasicCourseSearch/CourseOverTimeSearchForm";



jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

let axiosMock;
describe("CourseOverTimeSearchForm tests", () => {


  describe("CourseOverTimeSearchForm regular tests", () => {
    const addToast = jest.fn();
    const queryClient = new QueryClient();
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => null);

      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet("/api/systemInfo").reply(200, {
        ...systemInfoFixtures.showingNeither,
        startQtrYYYYQ: "20201",
        endQtrYYYYQ: "20214",
      });

      toast.mockReturnValue({
        addToast: addToast,
      });
    });

    afterEach(() => {
      axiosMock.restore();
      axiosMock.reset();
      jest.clearAllMocks();
      axiosMock.resetHistory();
      cleanup();
      localStorage.clear();
    });

    test("renders correctly", () => {
      axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      getItemSpy.mockImplementation(() => null);
      setItemSpy.mockImplementation(() => null);
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      expect(
        screen.getByTestId("CourseOverTimeSearchForm"),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Start Quarter")).toBeInTheDocument();
      expect(screen.getByLabelText("End Quarter")).toBeInTheDocument();
      expect(screen.getByLabelText("Subject Area")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Course Number (Try searching '16' or '130A')"),
      ).toBeInTheDocument();
      expect(screen.getByText("Submit")).toBeInTheDocument();
      const buttonRow = screen.getByTestId("CourseOverTimeSearchForm.ButtonRow");
      expect(buttonRow).toBeInTheDocument();
      expect(buttonRow).toHaveClass("my-2");
      expect(buttonRow.querySelector("button")).toHaveTextContent("Submit");
      expect(buttonRow.querySelector("button")).toHaveClass("btn-primary");
      expect(buttonRow.querySelector("button")).toHaveAttribute("type", "submit");

      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.StartQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.EndQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.Subject");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.CourseNumber");

    });

    test("renders correctly with mocked localStorage values", async () => {
      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

      getItemSpy.mockImplementation((key) => {
        if (key === "CourseOverTimeSearch.StartQuarter") return "20211";
        if (key === "CourseOverTimeSearch.EndQuarter") return "20214";
        if (key === "CourseOverTimeSearch.Subject") return "CMPSC";
        if (key === "CourseOverTimeSearch.CourseNumber") return "130A";
        return null;
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>
      );

      // The component should read from localStorage and set the state accordingly.
      // The mutation will fail this test if the key is incorrect.
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.StartQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.EndQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.Subject");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.CourseNumber");

      // Now, check that the rendered form elements have the correct initial values.
      await waitFor(() => {
        expect(screen.getByLabelText("Start Quarter")).toHaveValue("20211");
      });
      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.Subject-option-MATH")).toBeInTheDocument();
      });
      expect(screen.getByLabelText("End Quarter")).toHaveValue("20214");
      expect(screen.getByLabelText("Subject Area")).toHaveValue("CMPSC");
      expect(screen.getByLabelText("Course Number (Try searching '16' or '130A')")).toHaveValue("130A");
    });

    test("renders with correct default subject area", async () => {
      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

      getItemSpy.mockImplementation(() => {return null;});

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>
      );

      // The component should read from localStorage and set the state accordingly.
      // The mutation will fail this test if the key is incorrect.
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.StartQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.EndQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.Subject");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.CourseNumber");

      // Now, check that the rendered form elements have the correct initial values.
   
      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.Subject-option-ANTH")).toBeInTheDocument();
      });
      expect(screen.getByLabelText("Subject Area")).toHaveValue("ANTH");
    });

    test("when I select an end quarter, the state for end quarter changes", async () => {
      axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      getItemSpy.mockImplementation(() => null);
      setItemSpy.mockImplementation(() => null);
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.StartQuarter-option-0")).toHaveValue("20201");
      });
      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.Subject-option-MATH")).toBeInTheDocument();
      });
      const selectEndQuarter = screen.getByLabelText("End Quarter");
      userEvent.selectOptions(selectEndQuarter, "20204");
      expect(selectEndQuarter.value).toBe("20204");

      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.StartQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.EndQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.Subject");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.CourseNumber");
    });

    test("when I select a subject, the state for subject changes", async () => {
      axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      getItemSpy.mockImplementation(() => null);
      setItemSpy.mockImplementation(() => null);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.StartQuarter-option-0")).toHaveValue("20201");
      });
      const expectedKey = await screen.findByTestId(
        "CourseOverTimeSearch.Subject-option-MATH",
      );
      expect(expectedKey).toBeInTheDocument();

      const selectSubject = screen.getByLabelText("Subject Area");
      userEvent.selectOptions(selectSubject, "MATH");

      expect(selectSubject.value).toBe("MATH");

      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.StartQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.EndQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.Subject");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.CourseNumber");
    });

    test("when I select a course number without suffix, the state for course number changes", async () => {

      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      getItemSpy.mockImplementation(() => null);
      setItemSpy.mockImplementation(() => null);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.StartQuarter-option-0")).toHaveValue("20201");
      });
      const selectCourseNumber = screen.getByLabelText(
        "Course Number (Try searching '16' or '130A')",
      );
      userEvent.type(selectCourseNumber, "24");
      expect(selectCourseNumber.value).toBe("24");

      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.StartQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.EndQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.Subject");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.CourseNumber");
    });

    test("when I select a course number with suffix, the state for course number changes", async () => {
      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      getItemSpy.mockImplementation(() => null);
      setItemSpy.mockImplementation(() => null);


      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.StartQuarter-option-0")).toHaveValue("20201");
      });

      const selectCourseNumber = screen.getByLabelText(
        "Course Number (Try searching '16' or '130A')",
      );
      userEvent.type(selectCourseNumber, "130A");
      expect(selectCourseNumber.value).toBe("130A");

      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.StartQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.EndQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.Subject");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.CourseNumber");
    });

    test("when I select a course number without number, the state for course number changes", async () => {
      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      getItemSpy.mockImplementation(() => null);
      setItemSpy.mockImplementation(() => null);
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.StartQuarter-option-0")).toHaveValue("20201");
      });
      const selectCourseNumber = screen.getByLabelText(
        "Course Number (Try searching '16' or '130A')",
      );
      userEvent.type(selectCourseNumber, "A");
      expect(selectCourseNumber.value).toBe("A");

      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.StartQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.EndQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.Subject");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.CourseNumber");
    });

    test("when I click submit, the right stuff happens", async () => {
      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      getItemSpy.mockImplementation(() => null);
      setItemSpy.mockImplementation(() => null);

      axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
      const sampleReturnValue = {
        sampleKey: "sampleValue",
      };

      const fetchJSONSpy = jest.fn().mockResolvedValue(sampleReturnValue);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm fetchJSON={fetchJSONSpy} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.StartQuarter-option-0")).toHaveValue("20201");
      });
      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.Subject-option-MATH")).toBeInTheDocument();
      });
      const expectedFields = {
        startQuarter: "20211",
        endQuarter: "20214",
        subject: "CMPSC",
        courseNumber: "130",
        courseSuf: "A",
      };

      const expectedKey = await screen.findByTestId(
        "CourseOverTimeSearch.Subject-option-CMPSC",
      );
      expect(expectedKey).toBeInTheDocument();

      const selectStartQuarter = screen.getByLabelText("Start Quarter");
      userEvent.selectOptions(selectStartQuarter, "20211");
      const selectEndQuarter = screen.getByLabelText("End Quarter");
      userEvent.selectOptions(selectEndQuarter, "20214");
      const selectSubject = screen.getByLabelText("Subject Area");
      expect(selectSubject).toBeInTheDocument();
      userEvent.selectOptions(selectSubject, "CMPSC");
      const selectCourseNumber = screen.getByLabelText(
        "Course Number (Try searching '16' or '130A')",
      );
      userEvent.type(selectCourseNumber, "130A");
      const submitButton = screen.getByText("Submit");
      userEvent.click(submitButton);

      await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

      expect(fetchJSONSpy).toHaveBeenCalledWith(
        expect.any(Object),
        expectedFields,
      );

      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.StartQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.EndQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.Subject");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.CourseNumber");
    });

    test("when I click submit when JSON is EMPTY, setCourse is not called!", async () => {
      axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

      const sampleReturnValue = {
        sampleKey: "sampleValue",
        total: 0,
      };

      const fetchJSONSpy = jest.fn().mockResolvedValue(sampleReturnValue);
      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      getItemSpy.mockImplementation(() => null);
      setItemSpy.mockImplementation(() => null);
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm fetchJSON={fetchJSONSpy} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.StartQuarter-option-0")).toHaveValue("20201");
      });
      const expectedKey = await screen.findByTestId(
        "CourseOverTimeSearch.Subject-option-CMPSC",
      );
      expect(expectedKey).toBeInTheDocument();

      const selectStartQuarter = screen.getByLabelText("Start Quarter");
      userEvent.selectOptions(selectStartQuarter, "20204");
      const selectEndQuarter = screen.getByLabelText("End Quarter");
      userEvent.selectOptions(selectEndQuarter, "20204");
      const selectSubject = screen.getByLabelText("Subject Area");
      userEvent.selectOptions(selectSubject, "CMPSC");
      const selectCourseNumber = screen.getByLabelText(
        "Course Number (Try searching '16' or '130A')",
      );
      userEvent.type(selectCourseNumber, "130A");
      const submitButton = screen.getByText("Submit");
      userEvent.click(submitButton);

      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.StartQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.EndQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.Subject");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.CourseNumber");
    });

    test("renders without crashing when fallback values are used", async () => {

      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      getItemSpy.mockImplementation(() => null);
      setItemSpy.mockImplementation(() => null);

      axiosMock.onGet("/api/systemInfo").reply(200, {
        springH2ConsoleEnabled: false,
        showSwaggerUILink: false,
        startQtrYYYYQ: null, // use fallback value
        endQtrYYYYQ: null, // use fallback value
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.StartQuarter-option-0")).toHaveValue("20211");
      });
      expect(
        await screen.findByTestId(/CourseOverTimeSearch.StartQuarter-option-0/),
      ).toHaveValue("20211");
      expect(
        await screen.findByTestId(/CourseOverTimeSearch.StartQuarter-option-3/),
      ).toHaveValue("20214");

      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.StartQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.EndQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.Subject");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.CourseNumber");
    });


  });
  describe("CourseOverTimeSearchForm with null system info", () => {

    const addToast = jest.fn();
    const queryClient = new QueryClient();

    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => null);

      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet("/api/systemInfo").reply(200, {
        ...systemInfoFixtures.showingNeither,
        startQtrYYYYQ: "20201",
        endQtrYYYYQ: "20214",
      });

      toast.mockReturnValue({
        addToast: addToast,
      });
    });

    afterEach(() => {
      axiosMock.restore();
      axiosMock.reset();
      jest.clearAllMocks();
      axiosMock.resetHistory();
      cleanup();
    });
    test("when system info is null, fallback values are used", async () => {
      axiosMock.onGet("/api/systemInfo").reply(200, null);

      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      getItemSpy.mockImplementation(() => null);
      setItemSpy.mockImplementation(() => null);


      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.StartQuarter-option-0")).toHaveValue("20211");
      });
      expect(
        await screen.findByTestId(/CourseOverTimeSearch.StartQuarter-option-0/),
      ).toHaveValue("20211");
      expect(
        await screen.findByTestId(/CourseOverTimeSearch.StartQuarter-option-3/),
      ).toHaveValue("20214");

      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.StartQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.EndQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.Subject");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.CourseNumber");


    });
  });
  describe("CourseOverTimeSearchForm queryClient tests", () => {
    let queryClient;
    let invalidateQueriesSpy;
    let getQueryDataSpy;
    let useBackendSpy;

    const addToast = jest.fn();

    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => null);

      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet("/api/systemInfo").reply(200, {
        ...systemInfoFixtures.showingNeither,
        startQtrYYYYQ: "20201",
        endQtrYYYYQ: "20214",
      });

      toast.mockReturnValue({
        addToast: addToast,
      });
      queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      });
      invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");
      getQueryDataSpy = jest.spyOn(queryClient, "getQueryData");
      useBackendSpy = jest.spyOn(require("main/utils/useBackend"), "useBackend");
    });

    afterEach(() => {
      axiosMock.restore();
      axiosMock.reset();
      jest.clearAllMocks();
      axiosMock.resetHistory();
      cleanup();
      invalidateQueriesSpy.mockRestore(); // Restore original implementation of the spy
      queryClient.clear(); // Clear the React Query cache
    });

    test("correct cache keys are set up and invalidated", async () => {
      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await waitFor(() => {
        expect(screen.getByTestId("CourseOverTimeSearch.StartQuarter-option-0")).toHaveValue("20201");
      });
      expect(useBackendSpy).toHaveBeenCalledWith(
        ["/api/UCSBSubjects/all"],
        { "method": "GET", "url": "/api/UCSBSubjects/all" },
        []
      );

      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.StartQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.EndQuarter");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.Subject");
      expect(getItemSpy).toHaveBeenCalledWith("CourseOverTimeSearch.CourseNumber");

    });

  });
});
