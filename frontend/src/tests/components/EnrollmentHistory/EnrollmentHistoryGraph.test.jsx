import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { enrollmentDataPointFixtures } from "fixtures/enrollmentDataPointFixtures";
import EnrollmentHistoryGraph from "main/components/EnrollmentHistory/EnrollmentHistoryGraph";
import {
  createEnrollmentHistoryChartData,
  formatDateCreated,
  formatEnrollmentTooltip,
  getEnrollmentSeriesKey,
  getEnrollmentSeriesLabel,
} from "main/components/EnrollmentHistory/EnrollmentHistoryHelper";

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

describe("EnrollmentHistoryGraph tests", () => {
  test("formats data point series details", () => {
    const dataPoint = enrollmentDataPointFixtures.cmpsc130aLectureOverTime[0];

    expect(getEnrollmentSeriesKey(dataPoint)).toBe("07609-0100");
    expect(getEnrollmentSeriesLabel(dataPoint)).toBe("07609 - Section 0100");
  });

  test("formats chart labels and tooltip values", () => {
    expect(formatDateCreated("2026-04-06T08:15:00.000000")).toBe("2026-04-06");
    expect(formatEnrollmentTooltip(32, "07609 - Section 0100")).toEqual([
      "Enrollment: 32",
      "07609 - Section 0100",
    ]);
  });

  test("creates empty chart data when called with no argument", () => {
    const expectedEmptyChartData = {
      chartData: [],
      series: [],
    };

    expect(createEnrollmentHistoryChartData()).toEqual(expectedEmptyChartData);
    expect(createEnrollmentHistoryChartData()).toEqual(
      createEnrollmentHistoryChartData([]),
    );
  });

  test("creates chart data for multiple sections over time", () => {
    const { chartData, series } = createEnrollmentHistoryChartData(
      enrollmentDataPointFixtures.cmpsc130aMultipleSectionsOverTime,
    );

    expect(series).toEqual([
      { dataKey: "series0", name: "07609 - Section 0100" },
      { dataKey: "series1", name: "07617 - Section 0101" },
      { dataKey: "series2", name: "07625 - Section 0102" },
    ]);
    expect(chartData).toEqual([
      {
        dateCreated: "2026-04-13T08:15:00.000000",
        series0: 41,
        series1: 18,
        series2: 21,
      },
      {
        dateCreated: "2026-05-26T19:58:14.226209",
        series0: 48,
        series1: 24,
        series2: 27,
      },
    ]);
  });

  test("sorts chart data chronologically by date created", () => {
    const unsortedEnrollmentData = [
      {
        id: 1,
        yyyyq: "20262",
        enrollCd: "07609",
        courseId: "CMPSC   130A -1",
        section: "0100",
        enrollment: 30,
        dateCreated: "2026-05-03T08:15:00.000000",
      },
      {
        id: 2,
        yyyyq: "20262",
        enrollCd: "07609",
        courseId: "CMPSC   130A -1",
        section: "0100",
        enrollment: 10,
        dateCreated: "2026-05-01T08:15:00.000000",
      },
      {
        id: 3,
        yyyyq: "20262",
        enrollCd: "07609",
        courseId: "CMPSC   130A -1",
        section: "0100",
        enrollment: 20,
        dateCreated: "2026-05-02T08:15:00.000000",
      },
    ];

    const { chartData } = createEnrollmentHistoryChartData(
      unsortedEnrollmentData,
    );

    expect(
      chartData.map((dataPoint) => formatDateCreated(dataPoint.dateCreated)),
    ).toEqual(["2026-05-01", "2026-05-02", "2026-05-03"]);
    expect(chartData.map((dataPoint) => dataPoint.series0)).toEqual([
      10, 20, 30,
    ]);
  });

  test("creates one series across multiple quarters", () => {
    const { chartData, series } = createEnrollmentHistoryChartData(
      enrollmentDataPointFixtures.cmpsc130aMultipleQuarters,
    );

    expect(series).toEqual([
      { dataKey: "series0", name: "07609 - Section 0100" },
    ]);
    expect(chartData.map((dataPoint) => dataPoint.series0)).toEqual([
      62, 54, 48,
    ]);
  });

  test("renders with the default title and no data", () => {
    const { container } = render(<EnrollmentHistoryGraph />);

    expect(screen.getByTestId("enrollment-history-graph")).toBeInTheDocument();
    expect(screen.getByText("Enrollment History")).toBeInTheDocument();
    expect(
      screen.queryByText("undefined - Section undefined"),
    ).not.toBeInTheDocument();
    expect(container.querySelectorAll(".recharts-line")).toHaveLength(0);
  });

  test("renders multiple section lines and legend labels", async () => {
    render(
      <EnrollmentHistoryGraph
        data={enrollmentDataPointFixtures.cmpsc130aMultipleSectionsOverTime}
        title="CMPSC 130A Section Enrollment Over Time"
      />,
    );

    expect(
      screen.getByText("CMPSC 130A Section Enrollment Over Time"),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("07609 - Section 0100")).toBeInTheDocument();
      expect(screen.getByText("07617 - Section 0101")).toBeInTheDocument();
      expect(screen.getByText("07625 - Section 0102")).toBeInTheDocument();
    });
  });
});
