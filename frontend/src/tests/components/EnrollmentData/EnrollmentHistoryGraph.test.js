import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  oneEnrollmentDataPointArray,
  threeEnrollmentDataPointsArray,
} from "fixtures/enrollmentDataPointFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import EnrollmentHistoryGraph from "main/components/EnrollmentData/EnrollmentHistoryGraph";
import {
  formatTooltip,
  createCompleteEnrollmentData,
} from "main/components/EnrollmentData/EnrollmentHistoryGraph";

const mockedNavigate = jest.fn();

class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    // Mock implementation of the observe method
  }
  unobserve() {
    // Mock implementation of the unobserve method
  }
  disconnect() {
    // Mock implementation of the disconnect method
  }
}

global.ResizeObserver = ResizeObserver;

jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");

  return {
    ...OriginalModule,
    ResponsiveContainer: ({ height, children }) => (
      <OriginalModule.ResponsiveContainer width={800} height={height}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("Enrollment history tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty graph", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EnrollmentHistoryGraph enrollmentHistory={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected values for one graph", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EnrollmentHistoryGraph
            enrollmentHistory={oneEnrollmentDataPointArray}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Title to be implemented")).toBeInTheDocument();
  });

  // Tests for multiple graphs to be implemented.

  test("Correctly outputs data for one course", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <EnrollmentHistoryGraph
            enrollmentHistory={threeEnrollmentDataPointsArray}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const enrollmentHistoryGraphsContainer = screen.getByTestId(
      "enrollment-history-graphs",
    );

    await waitFor(
      () => {
        const points =
          enrollmentHistoryGraphsContainer.querySelectorAll(".recharts-dot");

        expect(points.length).toBe(3);
      },
      { timeout: 3000 },
    ); // This test takes longer to render than usual.

    const allWrappers =
      enrollmentHistoryGraphsContainer.querySelectorAll(".recharts-wrapper");
    expect(allWrappers).toHaveLength(1);
    const element = allWrappers[0];
    expect(element).toBeInTheDocument();

    fireEvent.mouseOver(element, { clientX: 200, clientY: 200 });

    expect(element).toBeVisible();
  });
});

describe("formatTooltip", () => {
  it("formats the tooltip text correctly", () => {
    const value = 50.123456;
    const props = { payload: { dateCreated: "2000:01:01T02:02:02" } };
    const result = formatTooltip(value, null, props);
    expect(result).toEqual([
      "Enrollment: 50.1, Date Created: 2000:01:01T02:02:02",
    ]);
  });
});

describe("createCompleteEnrollmentData", () => {
  it("get enrollment data points displayed correctly", () => {
    const data = [
      { enrollment: 50, dateCreated: "2020-05-14T17:50:52.360000" },
      { enrollment: 24, dateCreated: "2025-05-14T17:50:52.361636" },
      { enrollment: 125, dateCreated: "2025-05-14T17:50:52.356611" },
    ];

    const result = createCompleteEnrollmentData(data);

    expect(result).toEqual([
      { enrollment: 50, dateCreated: "2020-05-14T17:50:52.360000" },
      { enrollment: 24, dateCreated: "2025-05-14T17:50:52.361636" },
      { enrollment: 125, dateCreated: "2025-05-14T17:50:52.356611" },
    ]);
  });

  it("returns points at the x-axis when enrollment is zero", () => {
    const data = [
      { enrollment: 0, dateCreated: "2020-05-14T17:50:52.360000" },
      { enrollment: 0, dateCreated: "2025-05-14T17:50:52.361636" },
      { enrollment: 0, dateCreated: "2025-05-14T17:50:52.356611" },
    ];

    const result = createCompleteEnrollmentData(data);

    expect(result).toEqual([
      { enrollment: 0, dateCreated: "2020-05-14T17:50:52.360000" },
      { enrollment: 0, dateCreated: "2025-05-14T17:50:52.361636" },
      { enrollment: 0, dateCreated: "2025-05-14T17:50:52.356611" },
    ]);
  });
});

// Tests for multiple graphs to be implemented.
