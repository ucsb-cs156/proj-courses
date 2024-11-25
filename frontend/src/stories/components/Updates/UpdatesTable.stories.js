import React from "react";
import UpdatesTable from "main/components/Updates/UpdatesTable.js";
import { updatesFixtures } from "fixtures/updatesFixtures.js";

export default {
  title: "components/Updates/UpdatesTable.js",
  component: UpdatesTable,
};

const Template = (args) => {
  return <UpdatesTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  updates: [],
};

export const OneUpdate = Template.bind({});

OneUpdate.args = {
  updates: updatesFixtures.oneUpdate,
};

export const ThreeUpdates = Template.bind({});

ThreeUpdates.args = {
  updates: updatesFixtures.threeUpdates,
};
