import React from "react";

import EnrollmentDataGraphs from "main/components/EnrollmentData/EnrollmentDataGraph";
import {
  oneQuarterCourse,
  twoQuarterCourse,
  fullCourse,
} from "fixtures/gradeHistoryFixtures";

export default {
  title: "components/EnrollmentData/EnrollmentDataTable",
  component: EnrollmentDataGraphs,
};

const Template = (args) => {
  return <EnrollmentDataGraphs {...args} />;
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
