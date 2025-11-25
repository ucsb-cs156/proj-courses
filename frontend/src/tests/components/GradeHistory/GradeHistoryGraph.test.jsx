import { vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  oneQuarterCourse,
  twoQuarterCourse,
  fullCourse,
} from "fixtures/gradeHistoryFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import GradeHistoryGraph from "main/components/GradeHistory/GradeHistoryGraph";

const mockedNavigate = vi.fn();

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

// Credit to joshua-phillips's commment at the below link
// I was debugging this for so long and this finally rendered the ResponsiveContainer
// https://github.com/recharts/recharts/issues/2268#issuecomment-832287798
vi.mock("recharts", async () => {
  const OriginalModule = await vi.importActual("recharts");

  return {
    ...OriginalModule,
    ResponsiveContainer: ({ height, children }) => (
      <OriginalModule.ResponsiveContainer width={800} height={height}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
    Tooltip: (props) => {
      // If a formatter is provided, call it with sample data and render the result.
      // This ensures that Stryker mutants that empty the function body or return string will cause the test to fail.
      if (props.formatter) {
        const result = props.formatter(100.0, null, { payload: { count: 10 } });
        if (Array.isArray(result) && result.length > 0) {
          return <div>{result[0]}</div>;
        }
      }
      return <OriginalModule.Tooltip {...props} />;
    },
  };
});

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockedNavigate,
}));

describe("Grade history tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing for empty graph", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GradeHistoryGraph gradeHistory={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected values for one graph", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GradeHistoryGraph gradeHistory={oneQuarterCourse} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Fall 2009 - GONZALEZ T F")).toBeInTheDocument();
    // Verify the tooltip formatter output. This assertion kills the mutants.
    expect(
      screen.getByText("Percentage: 100.0%, Count: 10"),
    ).toBeInTheDocument();
  });

  test("Renders two graphs correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GradeHistoryGraph gradeHistory={twoQuarterCourse} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Fall 2009 - GONZALEZ T F")).toBeInTheDocument();
    expect(screen.getByText("Fall 2010 - GONZALEZ T F")).toBeInTheDocument();
  });

  test("Renders full course history correctly", () => {
    // This test covers the sort function's 'same year, different quarter' branch
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GradeHistoryGraph gradeHistory={fullCourse} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getAllByTestId("grade-history-graph")).toBeDefined();
  });

  test("Renders correctly when data has zero counts", () => {
    // This test covers the 'totalCount > 0' check in createCompleteGradeData
    const zeroData = [
      { grade: "A", count: 0, yyyyq: "20221", instructor: "SMITH" },
      { grade: "B", count: 0, yyyyq: "20221", instructor: "SMITH" },
    ];
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GradeHistoryGraph gradeHistory={zeroData} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByText("Winter 2022 - SMITH")).toBeInTheDocument();
  });

  test("Correctly outputs data for one quarter", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GradeHistoryGraph gradeHistory={oneQuarterCourse} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const gradeHistoryGraphsContainer = screen.getByTestId(
      "grade-history-graphs",
    );

    await waitFor(() => {
      const bars = gradeHistoryGraphsContainer.querySelectorAll(
        ".recharts-rectangle",
      );
      expect(bars.length).toBe(7);
    });

    const allWrappers =
      gradeHistoryGraphsContainer.querySelectorAll(".recharts-wrapper");
    expect(allWrappers).toHaveLength(1);
    const element = allWrappers[0];
    expect(element).toBeInTheDocument();

    fireEvent.mouseOver(element, { clientX: 200, clientY: 200 });

    expect(element).toBeVisible();
  });
});
