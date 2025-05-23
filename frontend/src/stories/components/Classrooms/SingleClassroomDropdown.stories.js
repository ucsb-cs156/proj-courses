import React, { useState } from "react";
import SingleClassroomDropdown from "main/components/Classrooms/SingleClassroomDropdown";

export default {
  title: "components/Classrooms/SingleClassroomDropdown",
  component: SingleClassroomDropdown,
};

const Template = (args) => {
  const [classroom, setClassroom] = useState("");

  return (
    <SingleClassroomDropdown
      buildingCode="GIRV"
      quarter="20221"
      classroom={classroom}
      setClassroom={setClassroom}
      {...args}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  controlId: "ClassroomDropdownDefault",
};

export const WithShowAll = Template.bind({});
WithShowAll.args = {
  controlId: "ClassroomDropdownWithShowAll",
  showAll: true,
};

export const WithCustomLabel = Template.bind({});
WithCustomLabel.args = {
  controlId: "ClassroomDropdownWithLabel",
  label: "Custom Label",
};
