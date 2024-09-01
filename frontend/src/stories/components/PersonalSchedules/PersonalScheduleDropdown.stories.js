import React, { useState } from "react";

import PersonalScheduleDropdown from "main/components/PersonalSchedules/PersonalScheduleDropdown";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";

export default {
  title: "components/PersonalSchedules/PersonalScheduleDropdown",
  component: PersonalScheduleDropdown,
};

const Template = (args) => {
  const [schedules, setSchedule] = useState(args.schedules[0]);

  return (
    <PersonalScheduleDropdown
      schedules={schedules}
      setSchedule={setSchedule}
      controlId={"SampleControlId"}
      label={"Schedule"}
      {...args}
    />
  );
};

export const onePersonalSchedule = Template.bind({});
onePersonalSchedule.args = {
  schedules: personalScheduleFixtures.onePersonalSchedule,
};

export const threePersonalSchedules = Template.bind({});
threePersonalSchedules.args = {
  schedules: personalScheduleFixtures.threePersonalSchedules,
};
