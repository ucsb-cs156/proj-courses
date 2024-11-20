import React from "react";
import SingleButtonJobForm from "main/components/Jobs/SingleButtonJobForm";

import { toast } from "react-toastify";

export default {
  title: "components/Jobs/SingleButtonJobForm",
  component: SingleButtonJobForm,
};

const Template = (args) => {
  return <SingleButtonJobForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  callback: () => {
    toast(`Submit was clicked`);
  },
  text: "Button",
};
