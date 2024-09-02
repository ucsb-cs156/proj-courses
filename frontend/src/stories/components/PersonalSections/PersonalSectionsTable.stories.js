import React from "react";

import PersonalSectionsTable from "main/components/PersonalSections/PersonalSectionsTable";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "components/PersonalSections/PersonalSectionsTable",
  component: PersonalSectionsTable,
};

const Template = (args) => {
  return <PersonalSectionsTable {...args} />;
};

const mswMocks = [
  http.delete("/api/courses/user/psid", ({ request }) => {
    toast(`Generated: ${request.method} ${request.url}`);
    return HttpResponse.json({}, { status: 200 });
  }),
];

export const Empty = Template.bind({});

Empty.args = {
  personalSections: [],
};

export const ThreeSections = Template.bind({});

ThreeSections.args = {
  personalSections: personalSectionsFixtures.threePersonalSections,
};
ThreeSections.parameters = {
  msw: mswMocks,
};

export const ThreeSubjectsAdminUser = Template.bind({});
ThreeSubjectsAdminUser.args = {
  personalSections: personalSectionsFixtures.threePersonalSections,
  currentUser: currentUserFixtures.adminUser,
};
ThreeSubjectsAdminUser.parameters = {
  msw: mswMocks,
};
