import React from "react";

import GradeHistoryGraphs from "main/components/GradeHistory/GradeHistoryGraph";
import {
  oneQuarterCourse,
  twoQuarterCourse,
  fullCourse,
} from "fixtures/gradeHistoryFixtures";

export default {
  title: "components/GradeHistory/GradeHistoryTable",
  component: GradeHistoryGraphs,
};

const Template = (args) => {
  return <GradeHistoryGraphs {...args} />;
};

export const Empty = Template.bind({});
Empty.args = {
  gradeHistory: [],
};

export const OneQuarterCourse = Template.bind({});
OneQuarterCourse.args = {
  gradeHistory: oneQuarterCourse,
};

export const TwoQuarterCourse = Template.bind({});
TwoQuarterCourse.args = {
  gradeHistory: twoQuarterCourse,
};

export const FullCourse = Template.bind({});
FullCourse.args = {
  gradeHistory: fullCourse,
};
