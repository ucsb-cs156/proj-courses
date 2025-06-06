import React, { useState } from "react";

import SingleAreaDropdown from "main/components/Areas/SingleAreaDropdown";
import {
  oneArea,
  threeAreas,
  outOfOrderAreas,
  allTheAreas,
} from "fixtures/areaFixtures";

export default {
  title: "components/Areas/SingleAreaDropdown",
  component: SingleAreaDropdown,
};

const Template = (args) => {
  const [areas, setArea] = useState(args.areas[0]);

  return (
    <SingleAreaDropdown
      areas={areas}
      setArea={setArea}
      controlId={"SampleControlId"}
      label={"Area"}
      {...args}
    />
  );
};

export const OneArea = Template.bind({});
OneArea.args = {
  areas: oneArea,
};

export const OneAreaWithShowAll = Template.bind({});
OneAreaWithShowAll.args = {
  areas: oneArea,
  showAll: true,
};

export const ThreeAreas = Template.bind({});
ThreeAreas.args = {
  areas: threeAreas,
};

export const ThreeAreasWithShowAll = Template.bind({});
ThreeAreasWithShowAll.args = {
  areas: threeAreas,
  showAll: true,
};

export const OutOfOrderAreas = Template.bind({});
OutOfOrderAreas.args = {
  areas: outOfOrderAreas,
};
export const OutOfOrderAreasWithShowAll = Template.bind({});
OutOfOrderAreasWithShowAll.args = {
  areas: outOfOrderAreas,
  showAll: true,
};

export const AllTheAreas = Template.bind({});
AllTheAreas.args = {
  areas: allTheAreas,
};

export const AllTheAreasWithShowAll = Template.bind({});
AllTheAreasWithShowAll.args = {
  areas: allTheAreas,
  showAll: true,
};
