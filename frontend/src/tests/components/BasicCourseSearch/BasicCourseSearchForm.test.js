import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { allTheSubjects } from "fixtures/subjectFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("BasicCourseSearchForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  beforeEach(() => {
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });
  const queryClient = new QueryClient();
  const addToast = jest.fn();
  beforeEach(() => {
    toast.mockReturnValue({
      addToast: addToast,
    });
  });

  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("when I select a quarter, the state for quarter changes", () => {
    const { getByLabelText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm />
        </MemoryRouter>
      </QueryClientProvider>
    );
    const selectQuarter = getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20204");
    expect(selectQuarter.value).toBe("20204");
  });

  test("when I select a subject, the state for subject changes", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    const { getByLabelText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });
    const selectSubject = getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "MATH");
    expect(selectSubject.value).toBe("MATH");
  });

  test("when I select a level, the state for level changes", () => {
    const { getByLabelText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm />
        </MemoryRouter>
      </QueryClientProvider>
    );
    const selectLevel = getByLabelText("Course Level");
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

    const { getByText, getByLabelText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedFields = {
      quarter: "20211",
      subject: "ANTH",
      level: "G",
    };

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const selectQuarter = getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20211");
    const selectSubject = getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "ANTH");
    const selectLevel = getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "G");
    const submitButton = getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

    expect(fetchJSONSpy).toHaveBeenCalledWith(
      expect.any(Object),
      expectedFields
    );
  });

  test("when I click submit when JSON is EMPTY, setCourse is not called!", async () => {
    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    const sampleReturnValue = {
      sampleKey: "sampleValue",
      total: 0,
    };

    const fetchJSONSpy = jest.fn();

    fetchJSONSpy.mockResolvedValue(sampleReturnValue);

    const { getByText, getByLabelText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BasicCourseSearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const selectQuarter = getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20204");
    const selectSubject = getByLabelText("Subject Area");
    userEvent.selectOptions(selectSubject, "MATH");
    const selectLevel = getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "G");
    const submitButton = getByText("Submit");
    userEvent.click(submitButton);
  });
});
