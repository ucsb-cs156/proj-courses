import { vi } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CourseOverTimeDescriptionSearchForm from "main/components/BasicCourseSearch/CourseOverTimeDescriptionSearchForm";

import { useSystemInfo } from "main/utils/systemInfo";

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

vi.mock("main/utils/systemInfo", () => ({
  useSystemInfo: vi.fn(),
}));

describe("CourseOverTimeDescriptionSearchForm tests", () => {
  describe("CourseOverTimeDescriptionSearchForm basic tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const queryClient = new QueryClient();
    const addToast = vi.fn();

    let localStorageStore = {};

    const mockLocalStorage = {
      getItem: vi.fn((key) => localStorageStore[key] ?? null),
      setItem: vi.fn((key, value) => {
        localStorageStore[key] = String(value);
      }),
      removeItem: vi.fn((key) => {
        delete localStorageStore[key];
      }),
      clear: vi.fn(() => {
        localStorageStore = {};
      }),
    };

    beforeEach(() => {
      vi.clearAllMocks();
      localStorageStore = {};

      Object.defineProperty(window, "localStorage", {
        value: mockLocalStorage,
        writable: true,
        configurable: true,
      });

      vi.stubGlobal("localStorage", mockLocalStorage);

      vi.spyOn(console, "error");
      console.error.mockImplementation(() => null);

      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      useSystemInfo.mockReturnValue({
        data: systemInfoFixtures.showingNeither,
        isLoading: false,
        isError: false,
      });
      toast.mockReturnValue({
        addToast: addToast,
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    test("when I select a start quarter, the state for start quarter changes", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const selectStartQuarter = screen.getByLabelText("Start Quarter");

      await userEvent.selectOptions(selectStartQuarter, "20201");

      expect(selectStartQuarter.value).toBe("20201");
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "CourseOverTimeDescriptionSearch.StartQuarter",
        "20201",
      );
      expect(
        localStorage.getItem("CourseOverTimeDescriptionSearch.StartQuarter"),
      ).toBe("20201");
      expect(localStorage.setItem).not.toHaveBeenCalledWith("", "20201");
    });

    test("when I select an end quarter, the state for end quarter changes", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const selectEndQuarter = screen.getByLabelText("End Quarter");

      await userEvent.selectOptions(selectEndQuarter, "20204");

      expect(selectEndQuarter.value).toBe("20204");
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "CourseOverTimeDescriptionSearch.EndQuarter",
        "20204",
      );
      expect(
        localStorage.getItem("CourseOverTimeDescriptionSearch.EndQuarter"),
      ).toBe("20204");
      expect(localStorage.setItem).not.toHaveBeenCalledWith("", "20204");
    });

    test("when I select the checkbox, the state for checkbox changes", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const selectCheckbox = screen.getByTestId(
        "CourseOverTimeDescriptionSearchForm-checkbox",
      );
      userEvent.click(selectCheckbox);
      expect(selectCheckbox.checked).toBe(true);
      expect(localStorage.setItem).toBeCalledWith(
        "CourseOverTimeDescriptionSearch.LectureOnly",
        "true",
      );
    });

    test("when I click submit, the right stuff happens", async () => {
      const sampleReturnValue = {
        sampleKey: "sampleValue",
      };

      const fetchJSONSpy = vi.fn();

      fetchJSONSpy.mockResolvedValue(sampleReturnValue);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm fetchJSON={fetchJSONSpy} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const expectedFields = {
        startQuarter: "20211",
        endQuarter: "20214",
        searchTerms: "data",
        lectureOnly: true,
      };

      const selectStartQuarter = screen.getByLabelText("Start Quarter");
      await userEvent.selectOptions(selectStartQuarter, "20211");
      const selectEndQuarter = screen.getByLabelText("End Quarter");
      await userEvent.selectOptions(selectEndQuarter, "20214");
      const searchTermsInput = screen.getByLabelText("Search Terms");
      await userEvent.type(searchTermsInput, "data");
      const selectCheckbox = screen.getByTestId(
        "CourseOverTimeDescriptionSearchForm-checkbox",
      );
      await userEvent.click(selectCheckbox);
      const submitButton = screen.getByText("Submit");
      await userEvent.click(submitButton);

      await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

      expect(fetchJSONSpy).toHaveBeenCalledWith(
        expect.any(Object),
        expectedFields,
      );

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "CourseOverTimeDescriptionSearch.SearchTerms",
        "data",
      );
    });

    test("Button padding is correct", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const buttonRow = screen.getByTestId(
        "CourseOverTimeDescriptionSearchForm-bottom-row",
      );

      expect(buttonRow).toHaveAttribute(
        "style",
        "padding-top: 10px; padding-bottom: 10px;",
      );
    });

    test("Fallbacks render correctly", () => {
      vi.clearAllMocks();
      axiosMock.reset();
      axiosMock.onGet("/api/systemInfo").reply(500);

      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => null);

      useSystemInfo.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const selectStartQuarter = screen.getByLabelText("Start Quarter");
      expect(selectStartQuarter).toBeInTheDocument();
    });
    test("when systemInfo data is undefined, fallback quarters are used", () => {
      useSystemInfo.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const selectStartQuarter = screen.getByLabelText("Start Quarter");
      const selectEndQuarter = screen.getByLabelText("End Quarter");

      expect(selectStartQuarter.value).toBe("20211");
      expect(selectEndQuarter.value).toBe("20214");
    });

    test("when I click submit with local storage values, they are retained", async () => {
      localStorage.setItem(
        "CourseOverTimeDescriptionSearch.StartQuarter",
        "20211",
      );
      localStorage.setItem(
        "CourseOverTimeDescriptionSearch.EndQuarter",
        "20214",
      );
      localStorage.setItem(
        "CourseOverTimeDescriptionSearch.SearchTerms",
        "machine learning",
      );
      localStorage.setItem(
        "CourseOverTimeDescriptionSearch.LectureOnly",
        "true",
      );

      const fetchJSONSpy = vi.fn();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeDescriptionSearchForm fetchJSON={fetchJSONSpy} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const expectedFields = {
        startQuarter: "20211",
        endQuarter: "20214",
        searchTerms: "machine learning",
        lectureOnly: true,
      };

      const submitButton = screen.getByText("Submit");
      userEvent.click(submitButton);

      await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

      expect(fetchJSONSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "submit" }),
        expectedFields,
      );
    });
  });
});
