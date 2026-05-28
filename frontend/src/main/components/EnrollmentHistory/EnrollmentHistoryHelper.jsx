// Stryker disable all: color choices are visual styling for chart series
export const lineColors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088fe",
  "#00c49f",
];
// Stryker restore all

export const getEnrollmentSeriesKey = (dataPoint) =>
  `${dataPoint.enrollCd}-${dataPoint.section}`;

export const getEnrollmentSeriesLabel = (dataPoint) =>
  `${dataPoint.enrollCd} - Section ${dataPoint.section}`;

export const formatDateCreated = (dateCreated) => dateCreated.slice(0, 10);

export const formatEnrollmentTooltip = (value, name) => [
  `Enrollment: ${value}`,
  name,
];

export const createEnrollmentHistoryChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) =>
    a.dateCreated.localeCompare(b.dateCreated),
  );
  const seriesByKey = new Map();
  const chartDataByDate = new Map();

  sortedData.forEach((dataPoint) => {
    const seriesKey = getEnrollmentSeriesKey(dataPoint);

    if (!seriesByKey.has(seriesKey)) {
      seriesByKey.set(seriesKey, {
        dataKey: `series${seriesByKey.size}`,
        name: getEnrollmentSeriesLabel(dataPoint),
      });
    }

    if (!chartDataByDate.has(dataPoint.dateCreated)) {
      chartDataByDate.set(dataPoint.dateCreated, {
        dateCreated: dataPoint.dateCreated,
      });
    }

    const chartRow = chartDataByDate.get(dataPoint.dateCreated);
    chartRow[seriesByKey.get(seriesKey).dataKey] = dataPoint.enrollment;
  });

  return {
    chartData: Array.from(chartDataByDate.values()),
    series: Array.from(seriesByKey.values()),
  };
};
