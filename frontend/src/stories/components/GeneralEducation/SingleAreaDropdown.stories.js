import React, { useState } from "react";

import SingleAreaDropdown from "main/components/GeneralEducation/SingleAreaDropdown";

import {
  oneArea,
  threeAreas,
  allTheAreas,
  outOfOrderAreas,
} from "fixtures/geAreaFixtures";

export default {
  title: "components/GeneralEducation/SingleAreaDropdown",
  component: SingleAreaDropdown,
};

const Template = (args) => {
  const [areas, setArea] = useState(args.areas[0]);

  return (
    <SingleAreaDropdown
      areas={areas}
      setArea={setArea}
      controlId={"SampleControlId"}
      label={"General Education Area"}
      {...args}
    />
  );
};

export const OneSubject = Template.bind({});
OneSubject.args = {
  areas: oneArea,
};

export const OneSubjectWithShowAll = Template.bind({});
OneSubjectWithShowAll.args = {
  areas: oneArea,
  showAll: true,
};

export const ThreeSubjects = Template.bind({});
ThreeSubjects.args = {
  areas: threeAreas,
};

export const ThreeSubjectsWithShowAll = Template.bind({});
ThreeSubjectsWithShowAll.args = {
  areas: threeAreas,
  showAll: true,
};

export const AllTheSubjects = Template.bind({});
AllTheSubjects.args = {
  areas: allTheAreas,
};

export const AllTheSubjectsWithShowAll = Template.bind({});
AllTheSubjectsWithShowAll.args = {
  areas: allTheAreas,
  showAll: true,
};

export const OutOfOrderAreas = Template.bind({});
OutOfOrderAreas.args = {
  areas: outOfOrderAreas,
  showAll: true,
};
