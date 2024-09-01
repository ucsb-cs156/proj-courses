import React from "react";

import SectionsInstructorTable from "main/components/Sections/SectionsInstructorTable";
import { oneSection, sixSections } from "fixtures/sectionOverTimeFixtures";

export default {
  title: "components/Sections/SectionsInstructorTable",
  component: SectionsInstructorTable,
};

const Template = (args) => {
  return <SectionsInstructorTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  sections: [],
};

export const OneSection = Template.bind({});

OneSection.args = {
  sections: oneSection,
};

export const SixSections = Template.bind({});

SixSections.args = {
  sections: sixSections,
};
