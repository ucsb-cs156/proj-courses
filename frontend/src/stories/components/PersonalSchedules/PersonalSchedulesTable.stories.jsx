import React from "react";

import PersonalSchedulesTable from "main/components/PersonalSchedules/PersonalSchedulesTable";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "components/PersonalSchedules/PersonalSchedulesTable",
  component: PersonalSchedulesTable,
};

const Template = (args) => {
  return <PersonalSchedulesTable {...args} />;
};

export const Empty = Template.bind({});

const mswMocks = [
  http.delete("/api/personalschedules", ({ request }) => {
    toast(`Generated:  ${request.method} ${request.url}`);
    return HttpResponse.json({}, { status: 200 });
  }),
];

Empty.args = {
  personalSchedules: [],
};

export const ThreeSubjects = Template.bind({});
ThreeSubjects.args = {
  personalSchedules: personalScheduleFixtures.threePersonalSchedules,
};
ThreeSubjects.parameters = {
  msw: mswMocks,
};

export const ThreeSubjectsAdminUser = Template.bind({});
ThreeSubjectsAdminUser.args = {
  personalSchedules: personalScheduleFixtures.threePersonalSchedules,
  currentUser: currentUserFixtures.adminUser,
};
ThreeSubjectsAdminUser.parameters = {
  msw: mswMocks,
};
