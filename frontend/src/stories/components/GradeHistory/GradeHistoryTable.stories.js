import React from "react";
import GradeHistoryTable from "main/components/GradeHistory/GradeHistoryTable";
import { gradeHistoryFixtures } from "fixtures/gradeHistoryFixtures";

export default {
  title: "components/GradeHistory/GradeHistoryTable",
  component: GradeHistoryTable,
};

const Template = (args) => {
  return <GradeHistoryTable {...args} />;
};

export const Empty = Template.bind({});
Empty.args = {
  gradeHistory: [],
};

export const GradeHistoryData = Template.bind({});
GradeHistoryData.args = {
  gradeHistory: gradeHistoryFixtures.gradeHistoryData,
};
