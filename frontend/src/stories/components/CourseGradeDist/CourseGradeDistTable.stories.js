import React from "react";

import CourseGradeDistTable from "main/components/CourseGradeDist/CourseGradeDistTable";
import { gradeDistFixtures } from "fixtures/courseGradeDistFixtures";

export default {
  title: "components/CourseGradeDist/CourseGradeDistTable",
  component: CourseGradeDistTable,
};

const Template = (args) => {
  return <CourseGradeDistTable {...args} />;
};

export const Empty = Template.bind({});
Empty.args = {
  gradeData: [],
};

export const oneGradeData = Template.bind({});
oneGradeData.args = {
  gradeData: gradeDistFixtures.oneGradeDist,
};

export const threeGradeData = Template.bind({});
threeGradeData.args = {
  gradeData: gradeDistFixtures.threeGradeDist,
};
