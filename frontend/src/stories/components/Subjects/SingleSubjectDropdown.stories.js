import React, { useState } from "react";

import SingleSubjectDropdown from "main/components/Subjects/SingleSubjectDropdown";
import {
  oneSubject,
  threeSubjects,
  allTheSubjects,
} from "fixtures/subjectFixtures";

export default {
  title: "components/Subjects/SingleSubjectDropdown",
  component: SingleSubjectDropdown,
};

const Template = (args) => {
  const [subjects, setSubject] = useState(args.subjects[0]);

  return (
    <SingleSubjectDropdown
      subjects={subjects}
      setSubject={setSubject}
      controlId={"SampleControlId"}
      label={"Subject"}
      {...args}
    />
  );
};

export const OneSubject = Template.bind({});
OneSubject.args = {
  subjects: oneSubject,
};

export const OneSubjectWithShowAll = Template.bind({});
OneSubjectWithShowAll.args = {
  subjects: oneSubject,
  showAll: true,
};

export const ThreeSubjects = Template.bind({});
ThreeSubjects.args = {
  subjects: threeSubjects,
};

export const ThreeSubjectsWithShowAll = Template.bind({});
ThreeSubjectsWithShowAll.args = {
  subjects: threeSubjects,
  showAll: true,
};

export const AllTheSubjects = Template.bind({});
AllTheSubjects.args = {
  subjects: allTheSubjects,
};

export const AllTheSubjectsWithShowAll = Template.bind({});
AllTheSubjectsWithShowAll.args = {
  subjects: allTheSubjects,
  showAll: true,
};
