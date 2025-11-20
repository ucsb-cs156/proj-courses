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
