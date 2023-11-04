import React, { useState } from "react";

import SingleLevelDropdown from "main/components/Levels/SingleLevelDropdown";
import { allTheLevels } from "fixtures/levelsFixtures";

export default {
  title: "components/Levels/SingleLevelDropdown",
  component: SingleLevelDropdown,
};

const Template = (args) => {
  const [level, setLevel] = useState(args.levels[1]);

  return (
    <SingleLevelDropdown
      levels={level}
      setLevel={setLevel}
      controlId={"SampleControlId"}
      label={"Level"}
      {...args}
    />
  );
};

export const AllLevels = Template.bind({});
AllLevels.args = {
  levels: allTheLevels,
};
