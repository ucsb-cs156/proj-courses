import React, { useState } from "react";
import SingleClassroomDropdown from "main/components/Classrooms/SingleClassroomDropdown";
import { http, HttpResponse } from 'msw';

export default {
  title: "components/Classrooms/SingleClassroomDropdown",
  component: SingleClassroomDropdown,
};

const classroomHandler = http.get(
  '/api/public/classrooms/roomnumbers',
  (req) => {
    const url = new URL(req.request.url);
    const buildingCode = url.searchParams.get('buildingCode');
    const quarter = url.searchParams.get('quarter');

    if (buildingCode === 'GIRV' && quarter === '20221') {
      return HttpResponse.json(['1430', '1108', '2128'], { status: 200 });
    }

    return HttpResponse.json(
      { message: 'No classrooms found' },
      { status: 404 }
    );
  }
);

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
Default.parameters = {
  msw: {
    handlers: [classroomHandler],
  },
};

export const WithShowAll = Template.bind({});
WithShowAll.args = {
  controlId: "ClassroomDropdownWithShowAll",
  showAll: true,
};
WithShowAll.parameters = {
  msw: {
    handlers: [classroomHandler],
  },
};

export const WithCustomLabel = Template.bind({});
WithCustomLabel.args = {
  controlId: "ClassroomDropdownWithLabel",
  label: "Custom Label",
};
WithCustomLabel.parameters = {
  msw: {
    handlers: [classroomHandler],
  },
};