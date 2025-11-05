import React from "react";
import UpdatesTable from "main/components/Updates/UpdatesTable.jsx";
import { updatesFixtures } from "fixtures/updatesFixtures.jsx";

export default {
  title: "components/Updates/UpdatesTable.jsx",
  component: UpdatesTable,
};

const Template = (args) => {
  return <UpdatesTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  updates: [],
};

export const ThreeUpdates = Template.bind({});

ThreeUpdates.args = {
  updates: updatesFixtures.threeUpdates,
};
