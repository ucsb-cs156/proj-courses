import React from "react";

import CourseDetailsIndexPage from "main/pages/CourseDetails/CourseDetailsIndexPage";

export default {
  title: "pages/CourseDetails/CourseDetailsIndexPage",
  component: CourseDetailsIndexPage,
  parameters: {

    qtr: "20221",
    enrollCode: "06619"
  }

};

const Template = () => <CourseDetailsIndexPage />;

export const Default = Template.bind({});
