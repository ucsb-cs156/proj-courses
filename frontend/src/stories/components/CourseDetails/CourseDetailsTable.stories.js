import React from "react";

import CourseDetailsTable from "main/components/CourseDetails/CourseDetailsTable";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";

export default {
  title: "components/CourseDetails/CourseDetailsTable",
  component: CourseDetailsTable,
};

const Template = (args) => {
  return <CourseDetailsTable {...args} />;
};

export const Empty = Template.bind({});
Empty.args = {
  details: [],
};

export const threeCourses = Template.bind({});
threeCourses.args = {
  details: personalSectionsFixtures.threePersonalSections,
};
