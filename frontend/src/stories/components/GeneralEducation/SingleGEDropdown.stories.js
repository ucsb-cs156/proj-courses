import React, { useState } from "react";

import SingleGEDropdown from "main/components/GeneralEducation/SingleGEDropdown";
import {
  oneGEArea,
  threeGEAreas,
  allTheGEAreas,
} from "fixtures/GEAreaFixtures";

export default {
  title: "components/GeneralEducation/SingleGEDropdown",
  component: SingleGEDropdown,
};

const Template = (args) => {
  const [areas, setArea] = useState(args.areas[0]);

  return (
    <SingleGEDropdown
      areas={areas}
      setArea={setArea}
      controlId={"SampleControlId"}
      label={"GE Area"}
      {...args}
    />
  );
};

export const OneArea = Template.bind({});
OneArea.args = {
  areas: oneGEArea,
};

export const OneAreaWithShowAll = Template.bind({});
OneAreaWithShowAll.args = {
  areas: oneGEArea,
  showAll: true,
};

export const ThreeAreas = Template.bind({});
ThreeAreas.args = {
  areas: threeGEAreas,
};

export const ThreeAreasWithShowAll = Template.bind({});
ThreeAreasWithShowAll.args = {
  areas: threeGEAreas,
  showAll: true,
};

export const AllTheAreas = Template.bind({});
AllTheAreas.args = {
  areas: allTheGEAreas,
};

export const AllTheAreasWithShowAll = Template.bind({});
AllTheAreasWithShowAll.args = {
  areas: allTheGEAreas,
  showAll: true,
};
