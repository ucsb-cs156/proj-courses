import React from "react";

import EnrollmentHistoryGraphs from "main/components/EnrollmentData/EnrollmentHistoryGraph";

import {
  oneEnrollmentDataPointArray,
  threeEnrollmentDataPointsArray,
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
  enrollmentHistory: [],
};

export const OneEnrollmentData = Template.bind({});
OneEnrollmentData.args = {
  enrollmentHistory: oneEnrollmentDataPointArray,
};

export const ThreeEnrollmentData = Template.bind({});
ThreeEnrollmentData.args = {
  enrollmentHistory: threeEnrollmentDataPointsArray,
};
