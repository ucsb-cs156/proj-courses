import React from "react";

import RoleBadge from "main/components/Profile/RoleBadge";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

export default {
  title: "components/Profile/RoleBadge",
  component: RoleBadge,
};

const Template = (args) => {
  return <RoleBadge {...args} />;
};

export const User = Template.bind({});
User.args = {
  role: "ROLE_USER",
  currentUser: currentUserFixtures.userOnly,
};

export const Admin = Template.bind({});
Admin.args = {
  role: "ROLE_ADMIN",
  currentUser: currentUserFixtures.adminUser,
};
