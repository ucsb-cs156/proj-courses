import React, { useState } from "react";

import SingleQuarterDropdown from "main/components/Quarters/SingleQuarterDropdown";

import { quarterRange } from "main/utils/quarterUtilities";

export default {
  title: "components/Quarters/SingleQuarterDropdown",
  component: SingleQuarterDropdown,
};

const Template = (args) => {
  const [quarter, setQuarter] = useState(args.quarters[0]);

  return (
    <SingleQuarterDropdown
      quarter={quarter}
      setQuarter={setQuarter}
      controlId={"SampleControlId"}
      label={"Quarter"}
      {...args}
    />
  );
};

export const OneQuarter = Template.bind({});
OneQuarter.args = {
  quarters: quarterRange("20211", "20211"),
};

export const OneQuarterWithShowAll = Template.bind({});
OneQuarterWithShowAll.args = {
  quarters: quarterRange("20211", "20211"),
  showAll: true,
};

export const ThreeQuarters = Template.bind({});
ThreeQuarters.args = {
  quarters: quarterRange("20204", "20212"),
};

export const ThreeQuartersWithShowAll = Template.bind({});
ThreeQuartersWithShowAll.args = {
  quarters: quarterRange("20204", "20212"),
  showAll: true,
};

export const ManyQuarters = Template.bind({});
ManyQuarters.args = {
  quarters: quarterRange("20081", "20213"),
};

export const ManyQuartersWithShowAll = Template.bind({});
ManyQuartersWithShowAll.args = {
  quarters: quarterRange("20081", "20213"),
  showAll: true,
};
