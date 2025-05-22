import React from "react";

import PersonalSchedulesWeeklyView from "main/components/PersonalSchedulesWeeklyView/PersonalSchedulesTable";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";

export default {
  title: "components/PersonalSchedulesWeeklyView/PersonalSchedulesWeeklyViewPanel",
  component: PersonalSchedulesWeeklyView,
};

const Template = (args) => {
  return <PersonalSchedulesWeeklyView {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  Events: [],
};

const eventParser = (personalSection) => {
  return {
    event: 
      personalSection
        .filter(section => section.classSections[0].timeLocations[0] !== undefined)
        .map(section => ({
          id: section.classSections[0].enrollCode.trim(),
          title: section.courseId.replaceAll(" ", ""),
          day: dayParser(section.classSections[0].timeLocations[0].days),
          name: section.title,
          description: section.description,
          area: section.classSections[0].timeLocations[0].building.trim() + " " + section.classSections[0].timeLocations[0].room.trim(),
          startTime: section.classSections[0].timeLocations[0].beginTime,
          endTime: section.classSections[0].timeLocations[0].endTime,
      })),
  }
}

export const SingleSection = Template.bind({});
SingleSection.args = {
  Events: eventParser(personalSectionsFixtures.singleSection).event,
};

export const ThreePersonalSections = Template.bind({});
ThreePersonalSections.args = {
  Events: eventParser(personalSectionsFixtures.threePersonalSections).event,
};