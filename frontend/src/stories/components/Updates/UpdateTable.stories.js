import React from "react";

import UpdateTable from "main/components/Updates/UpdateTable";
import { updateFixtures } from "fixtures/updateFixtures";

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
  updates: updateFixtures.oneUpdate,
};

export const ThreeUpdates = Template.bind({});

ThreeUpdates.args = {
  updates: updateFixtures.threeUpdates,
};
