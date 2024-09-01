import React from "react";
import UpdateGradeInfoJobForm from "main/components/Jobs/UpdateGradeInfoForm";

import { toast } from "react-toastify";

export default {
  title: "components/Jobs/UpdateGradeInfoForm",
  component: UpdateGradeInfoJobForm,
};

const Template = (args) => {
  return <UpdateGradeInfoJobForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  callback: () => {
    toast(`Submit was clicked`);
  },
};
