import React, { useState } from "react";

import SubjectAreaDropdown from "main/components/Subjects/SubjectAreaDropdown";
import {
  oneSubject,
  threeSubjects,
  allTheSubjects,
} from "fixtures/subjectFixtures";

export default {
  title: "components/Subjects/SubjectAreaDropdown",
  component: SubjectAreaDropdown,
};

const Template = (args) => {
  const [subjects, setSubject] = useState("ALL");

  return (
    <SubjectAreaDropdown
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

export const ThreeSubjects = Template.bind({});
ThreeSubjects.args = {
  subjects: threeSubjects,
};

export const AllTheSubjects = Template.bind({});
AllTheSubjects.args = {
  subjects: allTheSubjects,
};
