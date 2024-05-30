import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  oneQuarterCourse,
  twoQuarterCourse,
  fullCourse,
} from "fixtures/gradeHistoryFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import GradeHistoryGraph from "main/components/GradeHistory/GradeHistoryGraph";
import {
  formatTooltip,
  createCompleteGradeData,
  groupDataByQuarterAndInstructor,
} from "main/components/GradeHistory/GradeHistoryGraph";
import { Container } from "react-bootstrap";

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

// Credit to joshua-phillips's commment at the below link
// I was debugging this for so long and this finally rendered the ResponsiveContainer
// https://github.com/recharts/recharts/issues/2268#issuecomment-832287798
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
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GradeHistoryGraph gradeHistory={oneQuarterCourse} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      const bars = container.querySelectorAll(".recharts-rectangle");
      expect(bars.length).toBe(7);
    });

    const allWrappers = container.querySelectorAll(".recharts-wrapper");
    expect(allWrappers).toHaveLength(1);
    const element = allWrappers[0];
    expect(element).toBeInTheDocument();

    fireEvent.mouseOver(element, { clientX: 200, clientY: 200 });

    expect(element).toBeVisible();
    //const tooltipItems = element.querySelectorAll('recharts-tooltip-item');
    //console.log(Array.from(tooltipItems).map(item => item.textContent));
  });
});

describe("formatTooltip", () => {
  it("formats the tooltip text correctly", () => {
    const value = 50.123456;
    const props = { payload: { count: 10 } };
    const result = formatTooltip(value, null, props);
    expect(result).toEqual(["Percentage: 50.1%, Count: 10"]);
  });
});

describe("createCompleteGradeData", () => {
  it("calculates grade percentages correctly", () => {
    const data = [
      { grade: "A", count: 1 },
      { grade: "B", count: 2 },
      { grade: "C", count: 3 },
    ];

    const result = createCompleteGradeData(data);

    expect(result).toEqual([
      { grade: "A+", count: 0, percentage: 0 },
      { grade: "A", count: 1, percentage: 16.666666666666664 },
      { grade: "A-", count: 0, percentage: 0 },
      { grade: "B+", count: 0, percentage: 0 },
      { grade: "B", count: 2, percentage: 33.33333333333333 },
      { grade: "B-", count: 0, percentage: 0 },
      { grade: "C+", count: 0, percentage: 0 },
      { grade: "C", count: 3, percentage: 50 },
      { grade: "C-", count: 0, percentage: 0 },
      { grade: "D+", count: 0, percentage: 0 },
      { grade: "D", count: 0, percentage: 0 },
      { grade: "D-", count: 0, percentage: 0 },
      { grade: "F", count: 0, percentage: 0 },
      { grade: "P", count: 0, percentage: 0 },
      { grade: "W", count: 0, percentage: 0 },
      { grade: "NP", count: 0, percentage: 0 },
    ]);
  });

  it("returns zero percentage when total count is zero", () => {
    const data = [
      { grade: "A", count: 0 },
      { grade: "B", count: 0 },
      { grade: "C", count: 0 },
    ];

    const result = createCompleteGradeData(data);

    expect(result).toEqual([
      { grade: "A+", count: 0, percentage: 0 },
      { grade: "A", count: 0, percentage: 0 },
      { grade: "A-", count: 0, percentage: 0 },
      { grade: "B+", count: 0, percentage: 0 },
      { grade: "B", count: 0, percentage: 0 },
      { grade: "B-", count: 0, percentage: 0 },
      { grade: "C+", count: 0, percentage: 0 },
      { grade: "C", count: 0, percentage: 0 },
      { grade: "C-", count: 0, percentage: 0 },
      { grade: "D+", count: 0, percentage: 0 },
      { grade: "D", count: 0, percentage: 0 },
      { grade: "D-", count: 0, percentage: 0 },
      { grade: "F", count: 0, percentage: 0 },
      { grade: "P", count: 0, percentage: 0 },
      { grade: "W", count: 0, percentage: 0 },
      { grade: "NP", count: 0, percentage: 0 },
    ]);
  });
});

describe("groupDataByQuarterAndInstructor", () => {
  it("groups data by quarter and instructor correctly", () => {
    const result = groupDataByQuarterAndInstructor(fullCourse);

    // Check that the keys of the grouped data are correct
    const keys = Object.keys(result);
    console.log(result);
    expect(keys).toEqual([
      "20222-LOKSHTANOV D",
      "20221-SINGH A K",
      "20214-AGRAWAL D",
      "20212-EL ABBADI A",
      "20211-LOKSHTANOV D",
      "20204-AGRAWAL D",
      "20202-AGRAWAL D",
      "20201-KOC C K",
      "20194-SINGH A K",
      "20193-COAKLEY C J",
      "20192-SINGH A K",
      "20191-SURI S",
      "20184-EL ABBADI A",
      "20182-SINGH A K",
      "20181-AGRAWAL D",
      "20174-COAKLEY C J",
      "20172-SURI S",
      "20171-COAKLEY C J",
      "20164-AGRAWAL D",
      "20162-SURI S",
      "20161-EL ABBADI A",
      "20154-AGRAWAL D",
      "20153-GONZALEZ T F",
      "20152-GONZALEZ T F",
      "20151-SURI S",
      "20144-SURI S",
      "20143-GONZALEZ T F",
      "20142-KOC C K",
      "20141-EL ABBADI A",
      "20134-SINGH A K",
      "20133-GONZALEZ T F",
      "20132-KOC C K",
      "20131-EL ABBADI A",
      "20124-KOC C K",
      "20123-GONZALEZ T F",
      "20121-SINGH A K",
      "20114-GONZALEZ T F",
      "20113-GONZALEZ T F",
      "20111-SURI S",
      "20104-GONZALEZ T F",
      "20103-GONZALEZ T F",
      "20094-GONZALEZ T F",
    ]);

    // Check that the data for each key is correct
    keys.forEach((key) => {
      const data = result[key];
      const [yyyyq, instructor] = key.split("-");

      // Check that all items in the data have the correct yyyyq and instructor
      data.forEach((item) => {
        expect(item.yyyyq).toBe(yyyyq);
        expect(item.instructor).toBe(instructor);
      });
    });
  });
});
