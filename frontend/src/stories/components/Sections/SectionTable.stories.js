import React from "react";

import SectionsTable from "main/components/Sections/SectionsTable";
import {
  oneSection,
  threeSections,
  fiveSections,
  gigaSections,
} from "fixtures/sectionFixtures";

export default {
  title: "components/Sections/SectionsTable",
  component: SectionsTable,
};

const Template = (args) => {
  return <SectionsTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  sections: [],
};

export const OneSection = Template.bind({});

OneSection.args = {
  sections: oneSection,
};

export const ThreeSections = Template.bind({});

ThreeSections.args = {
  sections: threeSections,
};

export const FiveSections = Template.bind({});

FiveSections.args = {
  sections: fiveSections,
};

export const GigaSections = Template.bind({});

GigaSections.args = {
  sections: gigaSections,
};
