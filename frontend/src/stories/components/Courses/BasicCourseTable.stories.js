import React from "react";

import BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { coursesFixtures } from "fixtures/courseFixtures";

export default {
  title: "components/Courses/BasicCourseTable",
  component: BasicCourseTable,
};

const Template = (args) => {
  return <BasicCourseTable {...args} />;
};

export const Empty = Template.bind({});
Empty.args = {
  courses: [],
};

export const oneCourse = Template.bind({});
oneCourse.args = {
  courses: coursesFixtures.oneCourse,
};

export const twoCourses = Template.bind({});
twoCourses.args = {
  courses: coursesFixtures.twoCourses,
};
