import React from "react";

import CoursePrimaryTable from "main/components/Courses/CoursePrimaryTable";
import primaryFixtures from "fixtures/primaryFixtures";

export default {
  title: "components/Courses/CoursePrimaryTable",
  component: CoursePrimaryTable,
};

const Template = (args) => {
  return <CoursePrimaryTable {...args} />;
};

export const f24_math_lowerDiv = Template.bind({});
f24_math_lowerDiv.args = {
  primaries: primaryFixtures.f24_math_lowerDiv,
};

export const Empty = Template.bind({});
Empty.args = {
  primaries: [],
};
