import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Stryker disable all: don't need to mutate constant arrays I just have to make checking things easier

// List of all possible grades
const allGrades = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
  "P",
  "W",
  "NP",
];

// Stryker restore all

export const formatTooltip = (value, _, props) => {
  return [`Percentage: ${value.toFixed(1)}%, Count: ${props.payload.count}`];
};

// Helper function to fill in for when 0 students got a grade
export const createCompleteGradeData = (data) => {
  const gradeCounts = data.reduce((acc, item) => {
    acc[item.grade] = item.count;
    return acc;
  }, {});

  const totalCount = Object.values(gradeCounts).reduce(
    (acc, count) => acc + count,
    0,
  );

  return allGrades.map((grade) => ({
    grade,
    count: gradeCounts[grade] || 0,
    percentage:
      totalCount > 0 ? ((gradeCounts[grade] || 0) / totalCount) * 100 : 0,
  }));
};

export const createCompleteEnrollmentData = (data) => {
  var data_list = [];

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    data_list.push(element.enrollment, element.dateCreated);
  }

  return data_list;
};

// Helper function to group data by `yyyyq` and `instructor`
// This will allow different instructors in the same quarter to be displayed seperatly
export const groupDataByQuarterAndInstructor = (data) => {
  const groupedData = {};

  // Added sort function to be able to display data by most recent quarter
  data.sort((a, b) => {
    const [yearA, qtrA] = [a.yyyyq.slice(0, 4), a.yyyyq[4]];
    const [yearB, qtrB] = [b.yyyyq.slice(0, 4), b.yyyyq[4]];

    if (yearA !== yearB) {
      return yearB - yearA;
    } else {
      return qtrB - qtrA;
    }
  });

  data.forEach((item) => {
    const key = `${item.yyyyq}-${item.instructor}`;
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(item);
  });

  return groupedData;
};

// Component to render a single bar chart for a specific group of data
const _GradeLineChart = ({ data, title }) => {
  const completeData = createCompleteGradeData(data);

  return (
    <div data-testid="grade-history-graph">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={completeData}
          // Stryker disable all
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="grade" />
          <YAxis
            tickFormatter={(value) => `${value.toFixed(1)}%`}
            // Stryker restore all
          />

          <Legend />
          <Tooltip formatter={formatTooltip} />
          <Line dataKey="percentage" fill="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Component to render a single bar chart for a specific group of data
const EnrollmentHistoryLineChart = ({ _data, title }) => {
  const completeData = [{grade: "A", count: 1, percentage: 10},{grade: "B", count: 2, percentage: 20}];

  return (
      <div data-testid="grade-history-graph">
        <h3>{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data = {completeData} >
            <XAxis dataKey="grade" />
            <YAxis
              tickFormatter={(value) => `${value.toFixed(1)}%`}
              // Stryker restore all
            />

            <Legend />
            <Tooltip formatter={formatTooltip} />
            <Line dataKey="percentage" />
          </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

const EnrollmentHistoryGraphs = ({ _enrollmentHistory }) => {
  const enrollmentHistory = [
    {
      data: [1, 2, 3],
    },
 ];

  return (
    <div data-testid="enrollment-history-graphs">
        <EnrollmentHistoryLineChart 
        data={enrollmentHistory}
        title={"t"} />
  </div>
  );
};

export default EnrollmentHistoryGraphs;