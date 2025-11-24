import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  formatTooltip,
  createCompleteGradeData,
  groupDataByQuarterAndInstructor,
} from "main/components/GradeHistory/GradeHistoryHelper";

// Stryker disable all: don't need to mutate constant arrays I just have to make checking things easier

const qtrNumToQuarter = {
  1: "Winter",
  2: "Spring",
  3: "Summer",
  4: "Fall",
};

// Stryker restore all

//from an input YYYYQ, create a prettier formated output that I like
const yyyyqToPrettyStr = (yyyyq) => {
  const [year, qtr] = [yyyyq.slice(0, 4), yyyyq[4]];
  return `${qtrNumToQuarter[qtr]} ${year}`;
};

// Component to render a single bar chart for a specific group of data
const GradeBarChart = ({ data, title }) => {
  const completeData = createCompleteGradeData(data);

  return (
    <div data-testid="grade-history-graph">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
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
          <Bar dataKey="percentage" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const GradeHistoryGraphs = ({ gradeHistory }) => {
  const groupedData = groupDataByQuarterAndInstructor(gradeHistory);

  return (
    <div data-testid="grade-history-graphs">
      {Object.keys(groupedData).map((key) => {
        const data = groupedData[key];
        const title = `${yyyyqToPrettyStr(data[0].yyyyq)} - ${
          data[0].instructor
        }`;
        return <GradeBarChart key={key} data={data} title={title} />;
      })}
    </div>
  );
};

export default GradeHistoryGraphs;
