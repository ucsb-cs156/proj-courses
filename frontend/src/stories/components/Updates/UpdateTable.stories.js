import React from "react";

import UpdateTable from "main/components/Updates/UpdateTable";
import { oneUpdate, threeUpdates } from "fixtures/updateFixtures";

export default {
  title: "components/Updates/UpdateTable",
  component: UpdateTable,
};

const Template = (args) => {
  return <UpdateTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  updates: [],
};

export const OneUpdate = Template.bind({});

OneUpdate.args = {
  updates: oneUpdate,
};

export const ThreeUpdates = Template.bind({});

ThreeUpdates.args = {
  updates: threeUpdates,
};
