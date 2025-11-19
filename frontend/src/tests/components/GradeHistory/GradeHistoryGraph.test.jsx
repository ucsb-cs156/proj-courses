import { vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  oneQuarterCourse,
  twoQuarterCourse,
} from "fixtures/gradeHistoryFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import GradeHistoryGraph from "main/components/GradeHistory/GradeHistoryGraph";

const mockedNavigate = vi.fn();

class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

// Fix ResponsiveContainer rendering issues for tests
vi.mock("recharts", async () => {
  const OriginalModule = await vi.importActual("recharts");

  return {
    ...OriginalModule,
    ResponsiveContainer: ({ height, children }) => (
      <OriginalModule.ResponsiveContainer width={800} height={height}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockedNavigate,
}));

describe("GradeHistoryGraph UI tests", () => {
  const queryClient = new QueryClient();

  const renderGraph = (gradeHistory) =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GradeHistoryGraph gradeHistory={gradeHistory} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

  test("renders without crashing for empty graph", () => {
    renderGraph([]);
  });

  test("renders a single graph for one quarter of data", () => {
    renderGraph(oneQuarterCourse);

    expect(screen.getByText("Fall 2009 - GONZALEZ T F")).toBeInTheDocument();
  });

  test("renders two graphs for two quarters", () => {
    renderGraph(twoQuarterCourse);

    expect(screen.getByText("Fall 2009 - GONZALEZ T F")).toBeInTheDocument();
    expect(screen.getByText("Fall 2010 - GONZALEZ T F")).toBeInTheDocument();
  });

  test("renders correct number of bars for one quarter and responds to hover", async () => {
    renderGraph(oneQuarterCourse);

    const container = screen.getByTestId("grade-history-graphs");

    await waitFor(() => {
      const bars = container.querySelectorAll(".recharts-rectangle");
      // 7 bars expected for the oneQuarterCourse fixture
      expect(bars.length).toBe(7);
    });

    const wrappers = container.querySelectorAll(".recharts-wrapper");
    expect(wrappers).toHaveLength(1);

    const chartElement = wrappers[0];
    expect(chartElement).toBeInTheDocument();

    fireEvent.mouseOver(chartElement, { clientX: 200, clientY: 200 });

    expect(chartElement).toBeVisible();
  });
});
