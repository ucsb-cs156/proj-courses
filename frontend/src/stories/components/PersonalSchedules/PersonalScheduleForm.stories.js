import React from "react";

import PersonalScheduleForm from "main/components/PersonalSchedules/PersonalScheduleForm";
import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";
import { toast } from "react-toastify";

export default {
  title: "components/PersonalSchedules/PersonalScheduleForm",
  component: PersonalScheduleForm,
};

const Template = (args) => {
  return <PersonalScheduleForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  submitText: "Create",
  submitAction: (data) => {
    toast(`Submit was clicked, data=${JSON.stringify(data)}`);
  },
};

export const Show = Template.bind({});

Show.args = {
  personalSchedule: personalSchedulesFixtures.onePersonalSchedule,
  submitText: "",
  submitAction: (data) => {
    toast(`Submit was clicked, data=${JSON.stringify(data)}`);
  },
};
