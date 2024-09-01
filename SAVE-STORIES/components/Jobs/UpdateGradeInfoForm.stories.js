import React from "react";
import UpdateGradeInfoJobForm from "main/components/Jobs/UpdateGradeInfoForm";

export default {
  title: "components/Jobs/UpdateGradeInfoForm",
  component: UpdateGradeInfoJobForm,
};

const Template = (args) => {
  return <UpdateGradeInfoJobForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  callback: (data) => {
    console.log("Submit was clicked, data=", data);
  },
};
