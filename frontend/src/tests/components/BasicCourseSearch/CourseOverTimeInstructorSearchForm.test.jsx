import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { allTheSubjects } from "fixtures/subjectFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import CourseOverTimeSearchForm from "main/components/BasicCourseSearch/CourseOverTimeInstructorSearchForm";

import { useSystemInfo } from "main/utils/systemInfo";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

jest.mock("main/utils/systemInfo", () => ({
  useSystemInfo: jest.fn(),
}));

// import { useSystemInfo } from "main/utils/systemInfo";

describe("CourseOverTimeInstructorSearchForm tests", () => {
  describe("CourseOverTimeInstructorSearchForm basic tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const queryClient = new QueryClient();
    const addToast = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      localStorage.clear();
      jest.spyOn(console, "error");
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

    test("when I select a start quarter, the state for start quarter changes", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const selectStartQuarter = screen.getByLabelText("Start Quarter");
      userEvent.selectOptions(selectStartQuarter, "20201");
      expect(selectStartQuarter.value).toBe("20201");
    });

    test("when I select an end quarter, the state for end quarter changes", () => {
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

    test("when I select an instructor name, the state for instructor name changes", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const selectInstructor = screen.getByLabelText("Instructor Name");
      userEvent.type(selectInstructor, "conrad");
      expect(selectInstructor.value).toBe("conrad");
    });

    test("when I select the checkbox, the state for checkbox changes", () => {
      jest.spyOn(Storage.prototype, "setItem");

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const selectCheckbox = screen.getByTestId(
        "CourseOverTimeInstructorSearchForm-checkbox",
      );
      userEvent.click(selectCheckbox);
      expect(selectCheckbox.checked).toBe(true);
      expect(localStorage.setItem).toBeCalledWith(
        "CourseOverTimeInstructorSearch.Checkbox",
        "true",
      );
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
            <CourseOverTimeSearchForm fetchJSON={fetchJSONSpy} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const expectedFields = {
        startQuarter: "20211",
        endQuarter: "20214",
        instructor: "CONRAD",
        checkbox: true,
      };

      const selectStartQuarter = screen.getByLabelText("Start Quarter");
      userEvent.selectOptions(selectStartQuarter, "20211");
      const selectEndQuarter = screen.getByLabelText("End Quarter");
      userEvent.selectOptions(selectEndQuarter, "20214");
      const selectInstructor = screen.getByLabelText("Instructor Name");
      userEvent.type(selectInstructor, "CONRAD");
      const selectCheckbox = screen.getByTestId(
        "CourseOverTimeInstructorSearchForm-checkbox",
      );
      userEvent.click(selectCheckbox);
      const submitButton = screen.getByText("Submit");
      userEvent.click(submitButton);

      await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

      expect(fetchJSONSpy).toHaveBeenCalledWith(
        expect.any(Object),
        expectedFields,
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

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm fetchJSON={fetchJSONSpy} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const selectStartQuarter = screen.getByLabelText("Start Quarter");
      userEvent.selectOptions(selectStartQuarter, "20204");
      const selectEndQuarter = screen.getByLabelText("End Quarter");
      userEvent.selectOptions(selectEndQuarter, "20204");
      const selectInstructor = screen.getByLabelText("Instructor Name");
      userEvent.type(selectInstructor, "conrad");
      const selectCheckbox = screen.getByTestId(
        "CourseOverTimeInstructorSearchForm-checkbox",
      );
      userEvent.click(selectCheckbox);
      const submitButton = screen.getByText("Submit");
      userEvent.click(submitButton);
    });

    test("Button padding is correct", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const submitButton = screen.getByText("Submit");
      const buttonCol = submitButton.parentElement;
      const buttonRow = buttonCol.parentElement;
      expect(buttonRow).toHaveAttribute(
        "style",
        "padding-top: 10px; padding-bottom: 10px;",
      );
    });

    test("Fallbacks render correctly", () => {
      jest.clearAllMocks();
      axiosMock.reset();
      axiosMock.onGet("/api/systemInfo").reply(500);

      jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => null);

      useSystemInfo.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // Get all of the drop down options
      // Don't confuse the first and last option in the list with the
      // default values of start and end quarter; those are not the same thing!

      // Get just the options for the start quarter
      const startQtrOptions = Array.from(
        screen.getByLabelText("Start Quarter").querySelectorAll("option"),
      );

      expect(startQtrOptions[0].textContent).toBe("W21");
      expect(startQtrOptions[1].textContent).toBe("S21");
      expect(startQtrOptions[2].textContent).toBe("M21");
      expect(startQtrOptions[3].textContent).toBe("F21");
      expect(startQtrOptions.length).toBe(4);

      const startQuarter = screen.getByLabelText("Start Quarter");
      expect(startQuarter.value).toBe("20211");

      // Get all of the drop down options
      const endQtrOptions = Array.from(
        screen.getByLabelText("End Quarter").querySelectorAll("option"),
      );
      expect(endQtrOptions[0].textContent).toBe("W21");
      expect(endQtrOptions[1].textContent).toBe("S21");
      expect(endQtrOptions[2].textContent).toBe("M21");
      expect(endQtrOptions[3].textContent).toBe("F21");
      expect(endQtrOptions.length).toBe(4);

      const endQuarter = screen.getByLabelText("End Quarter");
      expect(endQuarter.value).toBe("20214");
    });
  });
  describe("CourseOverTimeInstructorSearchForm interactions with local storage", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const queryClient = new QueryClient();

    beforeEach(() => {
      jest.clearAllMocks();
      localStorage.clear();
      jest.spyOn(console, "error");
      console.error.mockImplementation(() => null);

      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      useSystemInfo.mockReturnValue({
        data: systemInfoFixtures.showingBoth,
        isLoading: false,
        isError: false,
      });
    });

    test("renders correctly when local storage has no values", () => {
      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
      getItemSpy.mockImplementation(() => null);

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      const bottomRow = screen.getByTestId(
        "CourseOverTimeInstructorSearchForm-bottom-row",
      );
      expect(bottomRow).toBeInTheDocument();
      expect(bottomRow).toHaveStyle("padding-top: 10px; padding-bottom: 10px;");
      const startQuarter = screen.getByLabelText("Start Quarter");
      expect(startQuarter).toBeInTheDocument();
      expect(startQuarter.value).toBe(
        systemInfoFixtures.showingNeither.startQtrYYYYQ,
      );
      const endQuarter = screen.getByLabelText("End Quarter");
      expect(endQuarter).toBeInTheDocument();
      expect(endQuarter.value).toBe(
        systemInfoFixtures.showingNeither.endQtrYYYYQ,
      );
    });

    it("checks the expected values in local storage", async () => {
      jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
        switch (key) {
          case "CourseOverTimeInstructorSearch.StartQuarter":
            return "20211";
          case "CourseOverTimeInstructorSearch.EndQuarter":
            return "20214";
          case "CourseOverTimeInstructorSearch.Instructor":
            return "Conrad";
          case "CourseOverTimeInstructorSearch.Checkbox":
            return "true";
          default:
            return null;
        }
      });
      const getItemSpy = jest.spyOn(Storage.prototype, "getItem");

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      expect(getItemSpy).toHaveBeenCalledWith(
        "CourseOverTimeInstructorSearch.StartQuarter",
      );
      expect(getItemSpy).toHaveBeenCalledWith(
        "CourseOverTimeInstructorSearch.EndQuarter",
      );
      expect(getItemSpy).toHaveBeenCalledWith(
        "CourseOverTimeInstructorSearch.Instructor",
      );
      expect(getItemSpy).toHaveBeenCalledWith(
        "CourseOverTimeInstructorSearch.Checkbox",
      );

      await waitFor(() => {
        expect(screen.getByLabelText("Start Quarter").value).toBe("20211");
      });

      expect(screen.getByLabelText("End Quarter").value).toBe("20214");
      expect(screen.getByLabelText("Instructor Name").value).toBe("Conrad");
      expect(
        screen.getByTestId("CourseOverTimeInstructorSearchForm-checkbox")
          .checked,
      ).toBe(true);
    });

    // test("when local storage has no end quarter value, it uses the default end quarter from system info", async () => {
    //   // We are using systemInfoFixtures.showingBoth, which has endQtrYYYYQ as "20222"
    //   // We will mock localStorage to return null for the end quarter specifically.
    //   jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
    //     if (key === "CourseOverTimeInstructorSearch.EndQuarter") {
    //       return null;
    //     }
    //     // For other keys, we can just return a non-null value so the component renders correctly.
    //     return "20211";
    //   });

    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <MemoryRouter>
    //         <CourseOverTimeSearchForm />
    //       </MemoryRouter>
    //     </QueryClientProvider>,
    //   );

    //   // Wait for the component to render and the state to be updated
    //   await waitFor(() => {
    //     // We expect the end quarter dropdown to be set to the default from the system info,
    //     // which you've identified as "20222".
    //     const endQuarterDropdown = screen.getByLabelText("End Quarter");
    //     expect(endQuarterDropdown).toBeInTheDocument();
    //     expect(endQuarterDropdown.value).toBe("20222");
    //   });

    //   // To be extra sure the mock is working, we can check if getItem was called correctly.
    //   expect(localStorage.getItem).toHaveBeenCalledWith("CourseOverTimeInstructorSearch.EndQuarter");
    // });

    test("when local storage is completely empty, it defaults to the system info quarters", async () => {
      // Clear local storage and mock getItem to ensure all values are null
      localStorage.clear();
      jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

      // We are using systemInfoFixtures.showingBoth, which has startQtrYYYYQ as "20221"
      // and endQtrYYYYQ as "20222".
      // We expect the dropdowns to be initialized to these values.
      useSystemInfo.mockReturnValue({
        data: {
          startQtrYYYYQ: "20221",
          endQtrYYYYQ: "20222",
        },
        isLoading: false,
        isError: false,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <CourseOverTimeSearchForm />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // Wait for the component to render and the state to be initialized
      await waitFor(() => {
        expect(screen.getByLabelText("Start Quarter")).toBeInTheDocument();
      });

      const startQuarterDropdown = screen.getByLabelText("Start Quarter");
      const endQuarterDropdown = screen.getByLabelText("End Quarter");

      expect(startQuarterDropdown.value).toBe("20221");
      expect(endQuarterDropdown).toBeInTheDocument();
      expect(endQuarterDropdown.value).toBe("20222");

      expect(localStorage.getItem).toHaveBeenCalledWith(
        "CourseOverTimeInstructorSearch.StartQuarter",
      );
      expect(localStorage.getItem).toHaveBeenCalledWith(
        "CourseOverTimeInstructorSearch.EndQuarter",
      );
    });
  });
});
