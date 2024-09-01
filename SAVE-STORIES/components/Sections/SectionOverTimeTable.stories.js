import React from "react";

import SectionsOverTimeTable from "main/components/Sections/SectionsOverTimeTable";
import { oneSection, sixSections } from "fixtures/sectionOverTimeFixtures";

export default {
  title: "components/Sections/SectionsOverTimeTable",
  component: SectionsOverTimeTable,
};

const Template = (args) => {
  return <SectionsOverTimeTable {...args} />;
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
