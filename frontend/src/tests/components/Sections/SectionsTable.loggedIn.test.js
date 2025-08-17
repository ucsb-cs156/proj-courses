import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SectionsTable, {
  onError,
  onSuccess,
} from "main/components/Sections/SectionsTable";
import { objectToAxiosParams } from "main/components/Sections/SectionsTable";

import primaryFixtures from "fixtures/primaryFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";

import { useBackendMutation } from "main/utils/useBackend";

// mock the error console to avoid cluttering the test output
import mockConsole from "jest-mock-console";
let restoreConsole;

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("react-toastify", () => {
  const toast = jest.fn();
  toast.error = jest.fn();
  return { toast };
});

jest.mock("main/utils/useBackend", () => ({
  useBackend: jest.fn(),
  useBackendMutation: jest.fn(),
}));

jest.mock("main/utils/currentUser", () => ({
  useCurrentUser: () => ({
    data: { loggedIn: true, root: { user: { email: "test@example.com" } } },
  }),
  useLogout: () => ({ mutate: jest.fn() }),
  hasRole: (_user, _role) => false, // or customize per role
}));

describe("SectionsTable tests", () => {
  describe("objectToAxiosParams", () => {
    it("should return the correct axios parameters", () => {
      const data = {
        enrollCd: 12345,
        psId: 15,
      };

      const result = objectToAxiosParams(data);

      expect(result).toEqual({
        url: "/api/courses/post",
        method: "POST",
        params: {
          enrollCd: "12345",
          psId: "15",
        },
      });
    });
  });

  describe("onSuccess", () => {
    it("should display a success message for new course creation", () => {
      const response = [{ id: 1, enrollCd: "12345" }];
      const toast = require("react-toastify").toast;
      onSuccess(response);
      expect(toast).toHaveBeenCalledWith(
        "New course Created - id: 1 enrollCd: 12345",
      );
    });

    it("should display a success message for course replacement", () => {
      const response = [
        { enrollCd: "12345" },
        { enrollCd: "67890" },
        { enrollCd: "54321" },
      ];
      const toast = require("react-toastify").toast;
      onSuccess(response);
      expect(toast).toHaveBeenCalledWith(
        "Course 12345 replaced old section 54321 with new section 67890",
      );
    });
  });

  describe("onError", () => {
    beforeEach(() => {
      restoreConsole = mockConsole();
      useBackendMutation.mockClear();
    });

    afterEach(() => {
      restoreConsole();
      jest.resetAllMocks();
    });

    it("should display an error message with the response data", () => {
      // arrange

      const queryClient = new QueryClient();
      const toast = require("react-toastify").toast;
      useBackendMutation.mockReturnValue({
        mutate: jest.fn(),
      });

      // Render a component that will call useBackendMutation
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const error = {
        response: {
          data: { message: "An error occurred" },
        },
      };

      // act
      onError(error);

      // assert
      expect(useBackendMutation).toHaveBeenCalledTimes(1);
      expect(useBackendMutation).toHaveBeenCalledWith(
        objectToAxiosParams,
        { onSuccess, onError },
        [],
      );

      expect(toast.error).toHaveBeenCalledWith("An error occurred");
      expect(console.error).toHaveBeenCalledWith("onError: error=", error);
    });

    it("should display a generic error message when no response data is available", () => {
      const error = {
        response: {},
      };
      const toast = require("react-toastify").toast;
      onError(error);
      expect(toast.error).toHaveBeenCalledWith(
        "An unexpected error occurred adding the schedule: " +
          JSON.stringify(error),
      );
    });
  });

  describe("Section Table tests", () => {
    let axiosMock;
    const queryClient = new QueryClient();

    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      jest.clearAllMocks();
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/personalschedules/all")
        .reply(200, personalScheduleFixtures.threePersonalSchedules);
      restoreConsole = mockConsole();
    });

    afterEach(() => {
      jest.clearAllMocks();
      axiosMock.restore();
      restoreConsole(); // Restore the console after each test
    });

    test("Error checking that schedules is an array works", () => {
      expect(() => {
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <SectionsTable
                sections={[]}
                schedules={{ message: "Not An Array" }}
              />
            </MemoryRouter>
          </QueryClientProvider>,
        );
      }).toThrowError("schedules prop must be an array");
    });

    test("Error checking that schedules is an array of objects with id property works", () => {
      expect(() => {
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <SectionsTable sections={[]} schedules={["Stryker was here"]} />
            </MemoryRouter>
          </QueryClientProvider>,
        );
      }).toThrowError(
        "schedules prop must be an array of objects with an 'id' property",
      );
    });

    test("renders without crashing for empty table", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={[]} schedules={[{ id: "1" }]} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
    });

    test("Has the expected cell values when expanded", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const expectedHeaders = [
        "Quarter",
        "Course ID",
        "Title",
        "Status",
        "Enrolled",
        "Location",
        "Days",
        "Time",
        "Instructor",
        "Enroll Code",
        "Info",
      ];
      const expectedFields = [
        "quarter",
        "courseId",
        "title",
        "status",
        "enrolled",
        "location",
        "days",
        "time",
        "instructor",
        "enrollCode",
        "info",
      ];
      const testId = "SectionsTable";

      expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });

      expectedFields.forEach((field) => {
        const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
      });

      const expandRow = screen.getByTestId(`${testId}-cell-row-1-col-expander`);
      fireEvent.click(expandRow);

      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
      ).toHaveTextContent("F24");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-time`),
      ).toHaveTextContent("8:00 AM - 8:50 AM");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-days`),
      ).toHaveTextContent("M");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-status`),
      ).toHaveTextContent("Open");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-enrolled`),
      ).toHaveTextContent("172/175");
      expect(
        screen.getByTestId(`${testId}-cell-row-2-col-location`),
      ).toHaveTextContent("ILP 1101");
      expect(
        screen.getByTestId(`${testId}-cell-row-2-col-instructor`),
      ).toHaveTextContent("SU X");
    });

    test("Has the expected column headers and content", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const expectedHeaders = [
        "Quarter",
        "Course ID",
        "Title",
        "Status",
        "Enrolled",
        "Location",
        "Days",
        "Time",
        "Instructor",
        "Enroll Code",
        "Action",
      ];
      const expectedFields = [
        "quarter",
        "courseId",
        "title",
        "status",
        "enrolled",
        "location",
        "days",
        "time",
        "instructor",
        "enrollCode",
        "action",
      ];
      const testId = "SectionsTable";

      expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });

      expectedFields.forEach((field) => {
        const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
      });
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-courseId`),
      ).toHaveTextContent("MATH 2A");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-title`),
      ).toHaveTextContent("CALC W/ ALG & TRIG");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
      ).toHaveTextContent("F24");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-time`),
      ).toHaveTextContent("8:00 AM - 8:50 AM");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-days`),
      ).toHaveTextContent("M");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-status`),
      ).toHaveTextContent("Open");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-enrolled`),
      ).toHaveTextContent("172/175");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-location`),
      ).toHaveTextContent("ILP 2101");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
      ).toHaveTextContent("PORTER M J");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-enrollCode`),
      ).toHaveTextContent("30247");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-action`),
      ).toBeDefined();
    });

    test("Info link is correct", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const testId = "SectionsTable";
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
      ).toHaveTextContent("PORTER M J");

      expect(
        screen.getByTestId(`${testId}-row-9-no-action`),
      ).toBeInTheDocument();

      expect(
        screen.getByTestId(`${testId}-row-26-cannot-expand`),
      ).toBeInTheDocument();

      const expandButton = screen.getByTestId(`${testId}-row-0-expand-button`);
      expect(expandButton).toBeInTheDocument();
      expect(expandButton).toHaveTextContent("➕");
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText("➖")).toBeInTheDocument();
      });

      const infoLink = screen.getByTestId(`${testId}-row-1-col-info-link`);
      expect(infoLink).toBeInTheDocument();
      expect(infoLink.tagName).toBe("A");
      expect(infoLink).toHaveAttribute("href", "/coursedetails/20244/30312");
      expect(infoLink).toHaveAttribute(
        "style",
        "color: black; background-color: inherit;",
      );

      const noQuarterSubRow = screen.getByTestId(
        `${testId}-cell-row-0.0-col-quarter`,
      );
      expect(noQuarterSubRow).toBeInTheDocument();
      expect(noQuarterSubRow).toBeEmptyDOMElement();
    });

    test("Expand all button works properly", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const testId = "SectionsTable";
      expect(screen.queryByText("➖")).not.toBeInTheDocument();

      const expandAllRows = screen.getByTestId(`${testId}-expand-all-rows`);
      expect(expandAllRows).toBeInTheDocument();
      expect(expandAllRows).toHaveTextContent("➕");
      fireEvent.click(expandAllRows);

      const expandAllRowsAfter = screen.getByTestId(
        `${testId}-expand-all-rows`,
      );
      expect(expandAllRowsAfter).toHaveTextContent("➖");
    });
  });

  describe("AddToScheduleModal interaction tests with mocked useBackendMutation", () => {
    let axiosMock;
    const queryClient = new QueryClient();
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      jest.clearAllMocks();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
    });

    afterEach(() => {
      jest.clearAllMocks();
      axiosMock.restore();
    });

    test("Add button in modal works correctly", async () => {
      const mockMutate = jest.fn();

      useBackendMutation.mockReturnValue({
        mutate: mockMutate,
      });

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable
              sections={primaryFixtures.f24_math_lowerDiv}
              schedules={personalScheduleFixtures.oneF24PersonalSchedule}
            />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const testId = "SectionsTable";

      // Expand all of the rows so that we can find an
      // "Add to Schedule" button

      const expandAllRows = screen.getByTestId(`${testId}-expand-all-rows`);
      expect(expandAllRows).toBeInTheDocument();
      expect(expandAllRows).toHaveTextContent("➕");
      fireEvent.click(expandAllRows);

      const expandAllRowsAfter = screen.getByTestId(
        `${testId}-expand-all-rows`,
      );
      expect(expandAllRowsAfter).toHaveTextContent("➖");

      await waitFor(() => {
        expect(
          screen.getByTestId(
            `${testId}-cell-row-0.1-col-action-add-to-schedule-button`,
          ),
        ).toBeInTheDocument();
      });

      const addToScheduleButton = screen.getByTestId(
        `${testId}-cell-row-0.1-col-action-add-to-schedule-button`,
      );
      expect(addToScheduleButton).toBeInTheDocument();
      fireEvent.click(addToScheduleButton);

      await waitFor(() => {
        expect(
          screen.getByTestId(`${testId}-cell-row-0.1-col-action-modal`),
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId(
            `${testId}-cell-row-0.1-col-action-no-schedules`,
          ),
        ).not.toBeInTheDocument();
      });

      // const scheduleSelect = screen.getByTestId(`${testId}-cell-row-0.1-col-action-schedule-selector`);
      // expect(scheduleSelect).toBeInTheDocument();
      // fireEvent.change(scheduleSelect, {
      //   target: { value: "2" }, // Assuming "2" is the ID of the schedule you want to select
      // });

      const saveButton = screen.getByTestId(
        `${testId}-cell-row-0.1-col-action-modal-save-button`,
      );
      expect(saveButton).toBeInTheDocument();
      fireEvent.click(saveButton);

      await waitFor(() => {
        // check that the <body> element has the class "modal-open"
        expect(document.body.classList.contains("modal-open")).toBe(false);
      });

      expect(mockMutate).toHaveBeenCalledWith({
        enrollCd: "30262",
        psId: 1,
      });
    });
  });

  describe("AddToScheduleModal interactions without mocking backend mutation", () => {
    const queryClient = new QueryClient();
    let axiosMock;
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      jest.clearAllMocks();
      jest.mock("main/utils/currentUser", () => ({
        useCurrentUser: () => ({
          data: {
            loggedIn: true,
            root: { user: { email: "test@example.com" } },
          },
        }),
        useLogout: () => ({ mutate: jest.fn() }),
        hasRole: (_user, _role) => false, // or customize per role
      }));
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
    });

    afterEach(() => {
      jest.clearAllMocks();
      axiosMock.restore();
    });

    test("Add to schedule modal opens and closes correctly", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const testId = "SectionsTable";

      // Expand all of the rows so that we can find an
      // "Add to Schedule" button

      const expandAllRows = screen.getByTestId(`${testId}-expand-all-rows`);
      expect(expandAllRows).toBeInTheDocument();
      expect(expandAllRows).toHaveTextContent("➕");
      fireEvent.click(expandAllRows);

      const expandAllRowsAfter = screen.getByTestId(
        `${testId}-expand-all-rows`,
      );
      expect(expandAllRowsAfter).toHaveTextContent("➖");

      await waitFor(() => {
        expect(
          screen.getByTestId(
            `${testId}-cell-row-0.1-col-action-add-to-schedule-button`,
          ),
        ).toBeInTheDocument();
      });

      const addToScheduleButton = screen.getByTestId(
        `${testId}-cell-row-0.1-col-action-add-to-schedule-button`,
      );
      expect(addToScheduleButton).toBeInTheDocument();
      fireEvent.click(addToScheduleButton);

      await waitFor(() => {
        // check that the <body> element has the class "modal-open"
        expect(document.body.classList.contains("modal-open")).toBe(true);
      });

      expect(
        screen.getByTestId(`${testId}-cell-row-0.1-col-action-modal`),
      ).toBeInTheDocument();

      const closeButton = screen.getByTestId(
        `${testId}-cell-row-0.1-col-action-modal-close-button`,
      );
      expect(closeButton).toBeInTheDocument();
      fireEvent.click(closeButton);

      await waitFor(() => {
        // check that the <body> element has the class "modal-open"
        expect(document.body.classList.contains("modal-open")).toBe(false);
      });
    });
  });

  describe("AddToScheduleModal interactions when there are no schedules", () => {
    jest.mock("main/utils/currentUser", () => ({
      useCurrentUser: () => {
        console.log("useCurrentUser called in SectionsTable.test.js");
        return {
          data: {
            loggedIn: true,
            root: { user: { email: "test@example.com" } },
          },
        };
      },
      useLogout: () => ({ mutate: jest.fn() }),
      hasRole: (_user, _role) => false, // or customize per role
    }));

    const queryClient = new QueryClient();
    let axiosMock;
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
    });

    afterEach(() => {
      axiosMock.restore();
    });

    test("When there are no schedules, the message about there being no schedules shows up", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable
              sections={primaryFixtures.f24_math_lowerDiv}
              // take the default to check that the default is no schedules
            />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const testId = "SectionsTable";

      // Expand all of the rows so that we can find an
      // "Add to Schedule" button

      const expandAllRows = screen.getByTestId(`${testId}-expand-all-rows`);
      expect(expandAllRows).toBeInTheDocument();
      expect(expandAllRows).toHaveTextContent("➕");
      fireEvent.click(expandAllRows);

      const expandAllRowsAfter = screen.getByTestId(
        `${testId}-expand-all-rows`,
      );
      expect(expandAllRowsAfter).toHaveTextContent("➖");

      await waitFor(() => {
        expect(
          screen.getByTestId(
            `${testId}-cell-row-0.2-col-action-add-to-schedule-button`,
          ),
        ).toBeInTheDocument();
      });

      const addToScheduleButton = screen.getByTestId(
        `${testId}-cell-row-0.2-col-action-add-to-schedule-button`,
      );
      expect(addToScheduleButton).toBeInTheDocument();
      fireEvent.click(addToScheduleButton);

      await waitFor(() => {
        // check that the <body> element has the class "modal-open"
        expect(document.body.classList.contains("modal-open")).toBe(true);
      });

      await waitFor(() => {
        expect(
          screen.getByTestId(`${testId}-cell-row-0.2-col-action-modal`),
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId(
            `${testId}-cell-row-0.2-col-action-no-schedules`,
          ),
        ).toBeInTheDocument();
      });
    });
  });
});
