import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { allTheSubjects } from "fixtures/subjectFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";

describe("BasicCourseSearchForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const originalEnv = process.env;
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.resetModules();
    process.env = {};
    jest.clearAllMocks();
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);
    localStorage.clear();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test.only("renders with correct defaults selected", async () => {
    process.env = {
      REACT_APP_START_QTR: "20204",
      REACT_APP_END_QTR: "20224",
    };
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Quarter")).toBeInTheDocument();

    const selectQuarter = screen.getByLabelText("Quarter");
    expect(selectQuarter.value).toBe("20204");

    await waitFor(() => {
      expect(
        screen.getByTestId("BasicSearch.Subject-option-ANTH"),
      ).toBeInTheDocument();
    });
    const selectSubject = screen.getByLabelText("Subject Area");
    expect(selectSubject.value).toBe("ANTH");

    const selectLevel = screen.getByLabelText("Course Level");
    expect(selectLevel.value).toBe("U");
  });

  test("when I select a quarter, the state for quarter changes", () => {
    process.env = {
      REACT_APP_START_QTR: "20194",
      REACT_APP_END_QTR: "20214",
    };
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20204");
    expect(selectQuarter.value).toBe("20204");
  });

  test("when I select a subject, the state for subject changes", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "BasicSearch.Subject-option-MATH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "MATH");

    expect(selectSubject.value).toBe("MATH");
  });

  test("when I select a level, the state for level changes", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectLevel = screen.getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "G");
    expect(selectLevel.value).toBe("G");
  });

  test("when I click submit, the right stuff happens", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    const sampleReturnValue = {
      sampleKey: "sampleValue",
    };

    const fetchJSONSpy = jest.fn();

    fetchJSONSpy.mockResolvedValue(sampleReturnValue);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedFields = {
      quarter: "20211",
      subject: "ANTH",
      level: "G",
    };

    const expectedKey = "BasicSearch.Subject-option-ANTH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20211");
    const selectSubject = screen.getByLabelText("Subject Area");
    expect(selectSubject).toBeInTheDocument();
    userEvent.selectOptions(selectSubject, "ANTH");
    const selectLevel = screen.getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "G");
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

    const fetchJSONSpy = jest.fn();

    fetchJSONSpy.mockResolvedValue(sampleReturnValue);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "BasicSearch.Subject-option-MATH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectQuarter = screen.getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20204");
    const selectSubject = screen.getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "MATH");
    const selectLevel = screen.getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "G");
    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);
  });

  test("Values from process.env should be used for start and end", async () => {
    // arrange

    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

    process.env = {
      REACT_APP_START_QTR: "20071",
      REACT_APP_END_QTR: "20074",
    };

    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation((key) => {
      const values = {
        "BasicSearch.Quarter": "20072",
        "BasicSearch.Subject": "MATH",
        "BasicSearch.Level": "G",
      };
      return key in values ? values[key] : null;
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Make sure the first and last options
    expect(
      await screen.findByTestId(/BasicSearch.Quarter-option-0/),
    ).toHaveValue("20071");
    expect(
      await screen.findByTestId(/BasicSearch.Quarter-option-3/),
    ).toHaveValue("20074");
  });

  test("When values are in local storage, they are used", async () => {
    // arrange

    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);

    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation((key) => {
      const values = {
        "BasicSearch.Quarter": JSON.stringify("20244"),
        "BasicSearch.Subject": JSON.stringify("MATH"),
        "BasicSearch.Level": JSON.stringify("G"),
      };
      return key in values ? values[key] : null;
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "BasicSearch.Subject-option-MATH";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectSubject = screen.getByLabelText("Subject Area");
    expect(selectSubject.value).toBe("MATH");
  });
});
