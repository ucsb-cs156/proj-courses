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
  yyyyqToPrettyStr,
  formatTooltip,
  createCompleteGradeData,
  groupDataByQuarterAndInstructor,
} from "./GradeHistoryHelper";

 

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
