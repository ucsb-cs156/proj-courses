import { vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SectionsTable from "main/components/Sections/SectionsTable";

import primaryFixtures from "fixtures/primaryFixtures";

import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";

// mock the error console to avoid cluttering the test output
import mockConsole from "tests/testutils/mockConsole";

// Mock useCurrentUser to return loggedOut
vi.mock("main/utils/currentUser", async () => ({
  useCurrentUser: () => ({
    data: { loggedIn: false, root: {} },
  }),
  useLogout: () => ({ mutate: vi.fn() }),
  hasRole: (_user, _role) => false,
}));

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => vi.fn(),
}));

vi.mock("react-toastify", async (importOriginal) => {
  const mockToast = vi.fn();
  mockToast.error = vi.fn();
  return {
    ...(await importOriginal()),
    toast: mockToast,
  };
});

describe("SectionsTable.loggedOut tests", () => {
  let restoreConsole;
  const queryClient = new QueryClient();

  const testId = "SectionsTable";

  beforeEach(() => {
    restoreConsole = mockConsole();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    restoreConsole();
  });

  test("Has the expected cell values when expanded", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-expand-all-rows`),
      ).toBeInTheDocument();
    });
    const expandAll = screen.getByTestId(`${testId}-expand-all-rows`);
    fireEvent.click(expandAll);

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-row-0-not-logged-in`),
      ).toBeInTheDocument();
    });

    const row0ExpandButton = screen.getByTestId(
      `${testId}-row-0-expand-button`,
    );
    expect(row0ExpandButton).toBeInTheDocument();
    expect(row0ExpandButton).toHaveAttribute("style", "cursor: pointer;");
  });

  test("should show not-logged-in indicator in action column when user is not logged in", async () => {
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

    // Expand all rows to see the action column
    const expandAllRows = screen.getByTestId(`${testId}-expand-all-rows`);
    fireEvent.click(expandAllRows);

    // Wait for the expanded rows with not-logged-in indicators
    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-row-0-not-logged-in`),
      ).toBeInTheDocument();
    });

    // Verify that no "Add to Schedule" buttons are visible
    const addToScheduleButtons = screen.queryAllByTestId(
      new RegExp(`${testId}-cell.*-col-action-add-to-schedule-button`),
    );
    expect(addToScheduleButtons).toHaveLength(0);
  });

  test("renders all expected column headers for logged out users", async () => {
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
      "Action",
    ];

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });
  });

  test("renders course data correctly for logged out users", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Check first row data
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-courseId`),
    ).toHaveTextContent("MATH 2A");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-title`),
    ).toHaveTextContent("CALC W/ ALG & TRIG");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
    ).toHaveTextContent("F24");
  });

  test("expand/collapse buttons work correctly for logged out users", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={primaryFixtures.f24_math_lowerDiv} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expandAllRows = screen.getByTestId(`${testId}-expand-all-rows`);
    expect(expandAllRows).toHaveTextContent("➕");

    fireEvent.click(expandAllRows);

    await waitFor(() => {
      expect(expandAllRows).toHaveTextContent("➖");
    });

    fireEvent.click(expandAllRows);

    await waitFor(() => {
      expect(expandAllRows).toHaveTextContent("➕");
    });
  });

  test("error thrown when schedules is not an array", () => {
    expect(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={[]} schedules="not-an-array" />
          </MemoryRouter>
        </QueryClientProvider>,
      );
    }).toThrow("schedules prop must be an array");
  });

  test("error thrown when schedules array contains objects without id property", () => {
    expect(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <SectionsTable sections={[]} schedules={[{ name: "Schedule" }]} />
          </MemoryRouter>
        </QueryClientProvider>,
      );
    }).toThrow(
      "schedules prop must be an array of objects with an 'id' property",
    );
  });

  test("renders with empty sections list", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={[]} schedules={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByTestId(`${testId}-expand-all-rows`)).toBeInTheDocument();
  });
});
