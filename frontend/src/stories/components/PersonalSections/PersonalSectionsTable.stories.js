import React from "react";

import PersonalSectionsTable from "main/components/PersonalSections/PersonalSectionsTable";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

export default {
  title: "components/PersonalSections/PersonalSectionsTable",
  component: PersonalSectionsTable,
};

const Template = (args) => {
  return <PersonalSectionsTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  personalSections: [],
};

export const ThreeSections = Template.bind({});

ThreeSections.args = {
  personalSections: personalSectionsFixtures.threePersonalSections,
};

export const ThreeSubjectsUser = Template.bind({});
ThreeSubjectsUser.args = {
  personalSections: personalSectionsFixtures.threePersonalSections,
  currentUser: currentUserFixtures.adminUser,
};
