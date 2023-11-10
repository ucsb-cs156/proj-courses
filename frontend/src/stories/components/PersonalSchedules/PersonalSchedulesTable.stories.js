import React from "react";

import PersonalSchedulesTable from "main/components/PersonalSchedules/PersonalSchedulesTable";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

export default {
  title: "components/PersonalSchedules/PersonalSchedulesTable",
  component: PersonalSchedulesTable,
};

const Template = (args) => {
  return <PersonalSchedulesTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  personalSchedules: [],
};

export const ThreeSubjects = Template.bind({});

ThreeSubjects.args = {
  personalSchedules: personalScheduleFixtures.threePersonalSchedules,
};

export const ThreeSubjectsUser = Template.bind({});
ThreeSubjectsUser.args = {
  personalSchedules: personalScheduleFixtures.threePersonalSchedules,
  currentUser: currentUserFixtures.adminUser,
};
