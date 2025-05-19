import React, { useState } from "react";
import SingleClassroomDropdown from "main/components/Classrooms/SingleClassroomDropdown";
import {
  oneClassroom,
  threeClassrooms,
  allClassrooms,
} from "fixtures/classroomFixtures";

export default {
  title: "components/Classrooms/SingleClassroomDropdown",
  component: SingleClassroomDropdown,
  argTypes: {
    building: { control: "text" },
    showAll:  { control: "boolean" },
  },
};

const Template = (args) => {
  const [selectedClassroom, setSelectedClassroom] = useState(args.classroom || "");
  return (
    <SingleClassroomDropdown
      {...args}
      classroom={selectedClassroom}
      setClassroom={setSelectedClassroom}
    />
  );
};

export const OneClassroom = Template.bind({});
OneClassroom.args = {
  building:   "ILP",            // matches oneClassroom fixture
  classrooms: oneClassroom,
  classroom:  "",
  controlId:  "demo-classroom-select",
  label:      "Classroom",
  showAll:    false,
};

export const ThreeClassrooms = Template.bind({});
ThreeClassrooms.args = {
  building:   "ILP",
  classrooms: threeClassrooms,
  classroom:  "",
  controlId:  "demo-classroom-select",
  label:      "Classroom",
  showAll:    false,
};

export const ShowAllOption = Template.bind({});
ShowAllOption.args = {
  building:   "ILP",             // building filter ignored when showAll=true
  classrooms: allClassrooms,    // shows all three entries
  classroom:  "",
  controlId:  "demo-classroom-select",
  label:      "Classroom",
  showAll:    true,
};
