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

  test("creates separate series for multiple quarters", () => {
    const { chartData, series } = createEnrollmentHistoryChartData(
      enrollmentDataPointFixtures.cmpsc130aMultipleQuarters,
    );

    expect(series).toEqual([
      { dataKey: "series0", name: "08344 - Section 0100" },
      { dataKey: "series1", name: "07452 - Section 0100" },
      { dataKey: "series2", name: "07609 - Section 0100" },
    ]);
    expect(chartData).toHaveLength(3);
  });

  test("renders with the default title and no data", () => {
    render(<EnrollmentHistoryGraph />);

    expect(screen.getByTestId("enrollment-history-graph")).toBeInTheDocument();
    expect(screen.getByText("Enrollment History")).toBeInTheDocument();
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
