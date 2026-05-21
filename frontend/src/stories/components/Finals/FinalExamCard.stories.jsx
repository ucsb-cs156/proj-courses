import React from "react";

import FinalExamCard from "main/components/Finals/FinalExamCard";
import { finalsFixtures } from "fixtures/finalsFixtures";

export default {
  title: "components/Finals/FinalExamCard",
  component: FinalExamCard,
};

const Template = (args) => {
  return <FinalExamCard {...args} />;
};

export const cmpsc24_s26 = Template.bind({});
cmpsc24_s26.args = {
  finalsInfo: finalsFixtures.cmpsc24_s26,
};

export const cmpsc196_s26 = Template.bind({});
cmpsc196_s26.args = {
  finalsInfo: finalsFixtures.cmpsc196_s26,
};

export const Empty = Template.bind({});
Empty.args = {
  finalsInfo: null,
};
