import React, { useState } from "react";

import SingleBuildingDropdown from "main/components/Buildings/SingleBuildingDropdown";
import {
  oneBuilding,
  threeBuildings,
  allBuildings,
} from "fixtures/buildingFixtures";

export default {
  title: "components/Buildings/SingleBuildingDropdown",
  component: SingleBuildingDropdown,
};

const Template = (args) => {
  const [buildings, setBuilding] = useState(args.buildings[0]);

  return (
    <SingleBuildingDropdown
      buildings={buildings}
      setBuilding={setBuilding}
      controlId={"SampleControlId"}
      label={"Building"}
      {...args}
    />
  );
};

export const OneBuilding = Template.bind({});
OneBuilding.args = {
  buildings: oneBuilding,
};

export const ThreeBuildings = Template.bind({});
ThreeBuildings.args = {
  buildings: threeBuildings,
};

export const AllBuildings = Template.bind({});
AllBuildings.args = {
  buildings: allBuildings,
};
