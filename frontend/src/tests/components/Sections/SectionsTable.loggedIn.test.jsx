import { vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SectionsTable from "main/components/Sections/SectionsTable";

import primaryFixtures from "fixtures/primaryFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";

import { toast } from "react-toastify";

// mock the error console to avoid cluttering the test output
import mockConsole from "tests/testutils/mockConsole";
let restoreConsole;
const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockedNavigate,
}));

vi.mock("react-toastify", async (importOriginal) => {
  const mockToast = vi.fn();
  mockToast.error = vi.fn();
  return {
    ...(await importOriginal()),
    toast: mockToast,
  };
});

vi.mock("main/utils/currentUser", async () => ({
  useCurrentUser: () => ({
    data: { loggedIn: true, root: { user: { email: "test@example.com" } } },
  }),
  useLogout: () => ({ mutate: vi.fn() }),
  hasRole: (_user, _role) => false, // or customize per role
}));

describe("SectionsTable tests", () => {
  describe("mutation interactions", () => {
    const testId = "SectionsTable";
    let axiosMock;
    let queryClient;

    const renderWithSchedules = () => {
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
    };

    const openFirstDiscussionModalAndSave = async () => {
      const expandAllRows = screen.getByTestId(`${testId}-expand-all-rows`);
      fireEvent.click(expandAllRows);

      await waitFor(() => {
        expect(
          screen.getByTestId(
            `${testId}-cell-row-0.1-col-action-add-to-schedule-button`,
          ),
        ).toBeInTheDocument();
      });

      fireEvent.click(
        screen.getByTestId(
          `${testId}-cell-row-0.1-col-action-add-to-schedule-button`,
        ),
      );

      await waitFor(() => {
        expect(
          screen.getByTestId(`${testId}-cell-row-0.1-col-action-modal`),
        ).toBeInTheDocument();
      });

      const saveButton = screen.getByTestId(
        `${testId}-cell-row-0.1-col-action-modal-save-button`,
      );
      fireEvent.click(saveButton);
    };

    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      queryClient = new QueryClient();
      vi.clearAllMocks();
      axiosMock.reset();
      axiosMock.resetHistory();
      restoreConsole = mockConsole();
    });

    afterEach(() => {
      axiosMock.restore();
      restoreConsole();
    });

    test("displays a success toast when backend creates a new course", async () => {
      axiosMock
        .onPost("/api/courses/post")
        .reply(200, [{ id: 1, enrollCd: "12345" }]);

      renderWithSchedules();
      await openFirstDiscussionModalAndSave();

      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(
          "New course Created - id: 1 enrollCd: 12345",
        );
      });
    });

    test("displays replacement toast when backend replaces an existing section", async () => {
      axiosMock
        .onPost("/api/courses/post")
        .reply(200, [
          { enrollCd: "12345" },
          { enrollCd: "67890" },
          { enrollCd: "54321" },
        ]);

      renderWithSchedules();
      await openFirstDiscussionModalAndSave();

      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(
          "Course 12345 replaced old section 54321 with new section 67890",
        );
      });
    });

    test("sends enrollCd and psId as axios params", async () => {
      axiosMock
        .onPost("/api/courses/post")
        .reply(200, [{ id: 99, enrollCd: "30262" }]);

      renderWithSchedules();
      await openFirstDiscussionModalAndSave();

      await waitFor(() => {
        expect(axiosMock.history.post.length).toBe(1);
      });
      expect(axiosMock.history.post[0].params).toEqual({
        enrollCd: "30262",
        psId: "1",
      });
    });

    test("shows server error message when backend returns message", async () => {
      axiosMock.onPost("/api/courses/post").reply(400, {
        message: "Course already exists in schedule",
      });

      renderWithSchedules();
      await openFirstDiscussionModalAndSave();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Course already exists in schedule",
        );
      });
    });

    test("falls back to generic error message when backend omits message", async () => {
      axiosMock.onPost("/api/courses/post").reply(500, {});

      renderWithSchedules();
      await openFirstDiscussionModalAndSave();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringContaining(
            "An unexpected error occurred adding the schedule:",
          ),
        );
      });
    });

    test("shows generic error when the request fails before the server responds", async () => {
      axiosMock.onPost("/api/courses/post").networkError();

      renderWithSchedules();
      await openFirstDiscussionModalAndSave();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringContaining(
            "An unexpected error occurred adding the schedule:",
          ),
        );
      });
    });
  });

  describe("Section Table tests", () => {
    let axiosMock;
    const queryClient = new QueryClient();

    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      vi.clearAllMocks();
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
      vi.clearAllMocks();
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

    test("Course ID link is correct", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const testId = "SectionsTable";

      const courseIdLink = screen.getByTestId(
        `${testId}-row-0-col-courseId-link`,
      );
      expect(courseIdLink).toBeInTheDocument();
      expect(courseIdLink.tagName).toBe("A");
      expect(courseIdLink).toHaveAttribute(
        "href",
        "/coursedetails/20244/30247",
      );
      expect(courseIdLink).toHaveAttribute("target", "_blank");
      expect(courseIdLink).toHaveTextContent("MATH 2A");
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

  describe("AddToScheduleModal interactions without mocking backend mutation", () => {
    const queryClient = new QueryClient();
    let axiosMock;
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      vi.clearAllMocks();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
    });

    afterEach(() => {
      vi.clearAllMocks();
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
          screen.getByTestId(`${testId}-cell-row-0.2-col-action-no-schedules`),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Column content verification tests", () => {
    const queryClient = new QueryClient();
    let axiosMock;

    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      vi.clearAllMocks();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      restoreConsole = mockConsole();
    });

    afterEach(() => {
      axiosMock.restore();
      restoreConsole();
    });

    test("Title column header and content are displayed", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const testId = "SectionsTable";

      // Verify the "Title" header is present
      expect(screen.getByText("Title")).toBeInTheDocument();

      // Verify the title content is displayed
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-title`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-title`),
      ).toHaveTextContent("CALC W/ ALG & TRIG");
    });

    test("Status column header and content are displayed with correct value", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const testId = "SectionsTable";

      // Verify the "Status" header is present
      expect(screen.getByText("Status")).toBeInTheDocument();

      // Verify the status content is displayed
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-status`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-status`),
      ).toHaveTextContent("Open");
    });

    test("Info link is displayed and clickable", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const testId = "SectionsTable";

      // Expand a row to see the info link
      const expandAllRows = screen.getByTestId(`${testId}-expand-all-rows`);
      fireEvent.click(expandAllRows);

      await waitFor(() => {
        const infoLink = screen.getByTestId(`${testId}-row-1-col-info-link`);
        expect(infoLink).toBeInTheDocument();
        expect(infoLink.tagName).toBe("A");
      });
    });

    test("shouldShowAddToScheduleLink filters out sections without schedules", async () => {
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

      const expandAllRows = screen.getByTestId(`${testId}-expand-all-rows`);
      fireEvent.click(expandAllRows);

      await waitFor(() => {
        // Check that row 0.1 has an action button (should show add to schedule)
        expect(
          screen.getByTestId(
            `${testId}-cell-row-0.1-col-action-add-to-schedule-button`,
          ),
        ).toBeInTheDocument();
      });

      // Check that some row has the no-action element (for sections that shouldn't show add to schedule)
      expect(
        screen.getByTestId(`${testId}-row-9-no-action`),
      ).toBeInTheDocument();
    });

    test("Shows add to schedule button only when shouldShowAddToScheduleLink returns true", async () => {
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

      const expandAllRows = screen.getByTestId(`${testId}-expand-all-rows`);
      fireEvent.click(expandAllRows);

      await waitFor(() => {
        // Verify at least one add to schedule button exists
        const buttons = screen.getAllByTestId(/add-to-schedule-button/);
        expect(buttons.length).toBeGreaterThan(0);
      });

      // Verify that the no-action span exists for sections that don't meet criteria
      expect(
        screen.getByTestId(`${testId}-row-9-no-action`),
      ).toBeInTheDocument();
    });

    test("Instructor column header and content are displayed", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const testId = "SectionsTable";

      // Verify the "Instructor" header is present
      expect(screen.getByText("Instructor")).toBeInTheDocument();

      // Verify the instructor content is displayed
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
      ).toHaveTextContent("PORTER M J");
    });

    test("Info link renders with correct href and styling", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      const testId = "SectionsTable";

      // Expand a row to see the info link in the second row
      const expandButton = screen.getByTestId(`${testId}-row-0-expand-button`);
      fireEvent.click(expandButton);

      await waitFor(() => {
        const infoLink = screen.getByTestId(`${testId}-row-1-col-info-link`);
        expect(infoLink).toBeInTheDocument();
        expect(infoLink.tagName).toBe("A");
        expect(infoLink).toHaveAttribute("href", "/coursedetails/20244/30312");
        expect(infoLink).toHaveAttribute(
          "style",
          "color: black; background-color: inherit;",
        );
      });
    });
  });
});
