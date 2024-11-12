import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { allTheSubjects } from "fixtures/subjectFixtures";
import SectionsOverTimeTable from "main/components/Sections/SectionsOverTimeTable";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CourseOverTimeSearchForm from "main/components/BasicCourseSearch/CourseOverTimeSearchForm";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("CourseOverTimeSearchForm tests", () => {
  const previousEnv = process.env;
  const axiosMock = new AxiosMockAdapter(axios);
  const queryClient = new QueryClient();
  const addToast = jest.fn();

  const mockSections = [
    {
      courseInfo: {
        quarter: "20231",
        courseId: "CMPSC156",
        title: "Advanced Applications Programming",
      },
      section: {
        section: "0100",
        enrolledTotal: 30,
        maxEnroll: 50,
        timeLocations: [],
        instructors: [],
        enrollCode: "12345",
      },
    },
  ];

  beforeEach(() => {
    process.env = {};
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
    process.env = previousEnv;
    cleanup();
  });

  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByText("Start Quarter")).toBeInTheDocument();
  });

  test("when I select an end quarter, the state for end quarter changes", () => {
    process.env = {
      REACT_APP_START_QTR: "20194",
      REACT_APP_END_QTR: "20214",
    };
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectEndQuarter = screen.getByLabelText("End Quarter");
    userEvent.selectOptions(selectEndQuarter, "20204");
    expect(selectEndQuarter.value).toBe("20204");
  });

  test("when I select a subject, the state for subject changes", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = await screen.findByTestId(
      "CourseOverTimeSearch.Subject-option-MATH",
    );
    expect(expectedKey).toBeInTheDocument();

    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "MATH");

    expect(selectSubject.value).toBe("MATH");
  });

  test("when I select a course number without suffix, the state for course number changes", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectCourseNumber = screen.getByLabelText(
      "Course Number (Try searching '16' or '130A')",
    );
    userEvent.type(selectCourseNumber, "24");
    expect(selectCourseNumber.value).toBe("24");
  });

  test("when I select a course number with suffix, the state for course number changes", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectCourseNumber = screen.getByLabelText(
      "Course Number (Try searching '16' or '130A')",
    );
    userEvent.type(selectCourseNumber, "130A");
    expect(selectCourseNumber.value).toBe("130A");
  });

  test("when I select a course number without number, the state for course number changes", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectCourseNumber = screen.getByLabelText(
      "Course Number (Try searching '16' or '130A')",
    );
    userEvent.type(selectCourseNumber, "A");
    expect(selectCourseNumber.value).toBe("A");
  });

  test("when I click submit, the right stuff happens", async () => {
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
  });

  test("when I click submit when JSON is EMPTY, setCourse is not called!", async () => {
    process.env = {
      REACT_APP_START_QTR: "20194",
      REACT_APP_END_QTR: "20214",
    };
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

    const sampleReturnValue = {
      sampleKey: "sampleValue",
      total: 0,
    };

    const fetchJSONSpy = jest.fn().mockResolvedValue(sampleReturnValue);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

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
  });

  test("renders without crashing when fallback values are used", async () => {
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

    expect(
      await screen.findByTestId(/CourseOverTimeSearch.StartQuarter-option-0/),
    ).toHaveValue("20211");
    expect(
      await screen.findByTestId(/CourseOverTimeSearch.StartQuarter-option-3/),
    ).toHaveValue("20214");
  });

  test("when I select a course number with the course area too, the course number just retains the number", async () => {
    const fetchJSONMock = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm fetchJSON={fetchJSONMock} />
          <SectionsOverTimeTable sections={mockSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "CMPSC");

    const selectCourseNumber = screen.getByLabelText(
      "Course Number (Try searching '16' or '130A')",
    );
    userEvent.type(selectCourseNumber, "CMPSC156");

    const submitButton = screen.getByText("Submit");

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByTestId(
          `SectionsOverTimeTable-cell-row-0-col-courseInfo.courseId`,
        ),
      ).toHaveTextContent("CMPSC");
    });
  });

  test("when I select a course number with the course area too (lowercase), the course number just retains the number", async () => {
    const fetchJSONMock = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm fetchJSON={fetchJSONMock} />
          <SectionsOverTimeTable sections={mockSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "CMPSC");

    const selectCourseNumber = screen.getByLabelText(
      "Course Number (Try searching '16' or '130A')",
    );

    userEvent.type(selectCourseNumber, "cmpsc 156");

    const submitButton = screen.getByText("Submit");

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByTestId(
          `SectionsOverTimeTable-cell-row-0-col-courseInfo.courseId`,
        ),
      ).toHaveTextContent("CMPSC");
    });
  });
  test("when I select a course number with the course area too (except cs), the course number just retains the number", async () => {
    const fetchJSONMock = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm fetchJSON={fetchJSONMock} />
          <SectionsOverTimeTable sections={mockSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "CMPSC");

    const selectCourseNumber = screen.getByLabelText(
      "Course Number (Try searching '16' or '130A')",
    );
    userEvent.type(selectCourseNumber, "cs156");

    const submitButton = screen.getByText("Submit");

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByTestId(
          `SectionsOverTimeTable-cell-row-0-col-courseInfo.courseId`,
        ),
      ).toHaveTextContent("CMPSC");
    });
  });
  test("when I select a course number with the course area too (random casing), the course number just retains the number", async () => {
    const fetchJSONMock = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm fetchJSON={fetchJSONMock} />
          <SectionsOverTimeTable sections={mockSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "CMPSC");
    const selectCourseNumber = screen.getByLabelText(
      "Course Number (Try searching '16' or '130A')",
    );
    userEvent.type(selectCourseNumber, "cMpSc156");

    const submitButton = screen.getByText("Submit");

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByTestId(
          `SectionsOverTimeTable-cell-row-0-col-courseInfo.courseId`,
        ),
      ).toHaveTextContent("CMPSC");
    });
  });
  test("when I select a course number with lowercase suffix, it still gives the correct output", async () => {
    const fetchJSONMock = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm fetchJSON={fetchJSONMock} />
          <SectionsOverTimeTable sections={mockSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectCourseNumber = screen.getByLabelText(
      "Course Number (Try searching '16' or '130A')",
    );

    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "CMPSC");

    userEvent.type(selectCourseNumber, "cmPsC         130a");

    const submitButton = screen.getByText("Submit");

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByTestId(
          `SectionsOverTimeTable-cell-row-0-col-courseInfo.courseId`,
        ),
      ).toHaveTextContent("CMPSC");
    });
  });
  test("when I select a course number with just the course number, just retains the number", async () => {
    const fetchJSONMock = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm fetchJSON={fetchJSONMock} />
          <SectionsOverTimeTable sections={mockSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "CMPSC");

    const selectCourseNumber = screen.getByLabelText(
      "Course Number (Try searching '16' or '130A')",
    );
    userEvent.type(selectCourseNumber, "156");

    const submitButton = screen.getByText("Submit");

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByTestId(
          `SectionsOverTimeTable-cell-row-0-col-courseInfo.courseId`,
        ),
      ).toHaveTextContent("CMPSC");
    });
  });

  test("when I select a course number but the subject area doesn't match, it doesn't take it", async () => {
    const fetchJSONMock = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CourseOverTimeSearchForm fetchJSON={fetchJSONMock} />
          <SectionsOverTimeTable sections={mockSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "MATH");

    const selectCourseNumber = screen.getByLabelText(
      "Course Number (Try searching '16' or '130A')",
    );
    userEvent.type(selectCourseNumber, "CMPSC156");
    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);
  });
});
