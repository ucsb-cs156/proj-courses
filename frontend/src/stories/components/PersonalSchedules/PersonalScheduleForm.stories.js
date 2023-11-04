import React from "react";

import PersonalScheduleForm from "main/components/PersonalSchedules/PersonalScheduleForm";
import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";

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
  submitAction: () => {
    console.log("Submit was clicked");
  },
};

export const Show = Template.bind({});

Show.args = {
  personalSchedule: personalSchedulesFixtures.onePersonalSchedule,
  submitText: "",
  submitAction: () => {},
};
