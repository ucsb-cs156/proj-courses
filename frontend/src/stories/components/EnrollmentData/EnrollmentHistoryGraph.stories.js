import React from "react";

import EnrollmentHistoryGraphs from "main/components/EnrollmentData/EnrollmentHistoryGraph";
import {
  oneQuarterCourse,
  twoQuarterCourse,
  fullCourse,
} from "fixtures/gradeHistoryFixtures";

export default {
  title: "components/EnrollmentData/EnrollmentDataTable",
  component: EnrollmentHistoryGraphs,
};

const Template = (args) => {
  return <EnrollmentHistoryGraphs {...args} />;
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
