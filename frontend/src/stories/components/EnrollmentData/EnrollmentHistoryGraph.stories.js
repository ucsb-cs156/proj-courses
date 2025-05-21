import React from "react";

import EnrollmentHistoryGraphs from "main/components/EnrollmentData/EnrollmentHistoryGraph";
import {
  oneQuarterCourse,
  // twoQuarterCourse,
  // fullCourse,
} from "fixtures/gradeHistoryFixtures";
import {
  oneEnrollmentDataPoint,
  threeEnrollmentDataPoints,
} from "fixtures/enrollmentDataPointFixtures";

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

export const OneEnrollmentData = Template.bind({});
OneEnrollmentData.args = {
  enrollmentHistory: oneEnrollmentDataPoint,
};

export const ThreeEnrollmentData = Template.bind({});
ThreeEnrollmentData.args = {
  enrollmentHistory: threeEnrollmentDataPoints,
};

export const OneQuarterCourse = Template.bind({});
OneQuarterCourse.args = {
  gradeHistory: oneQuarterCourse,
};

// export const TwoQuarterCourse = Template.bind({});
// TwoQuarterCourse.args = {
//   gradeHistory: twoQuarterCourse,
// };

// export const FullCourse = Template.bind({});
// FullCourse.args = {
//   gradeHistory: fullCourse,
// };
