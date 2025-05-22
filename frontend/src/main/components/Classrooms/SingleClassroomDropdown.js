import { compareValues } from "main/utils/sortHelper";
import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";

const SingleClassroomDropdown = ({
  building,
  classrooms,
  classroom,
  setClassroom,
  controlId,
  onChange = null,
  label = "Classroom",
  showAll = false,
}) => {
  const [value, setValue] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localStorage.getItem(controlId) || classroom || "",
  );

  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    localStorage.removeItem(controlId);
    // Stryker disable next-line all : not sure how to test/mock local storage
    setValue("");
    setClassroom("");
  }, [
    building, // reset when building changes
    controlId, // used inside effect
    setClassroom, // used inside effect
  ]);

  const handleChange = (e) => {
    const v = e.target.value;
    localStorage.setItem(controlId, v);
    setValue(v);
    setClassroom(v);
    if (onChange) onChange(e);
  };

  const options = (
    showAll ? classrooms : classrooms.filter((c) => c.buildingCode === building)
  ).sort(compareValues("roomNumber"));

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" value={value} onChange={handleChange}>
        {showAll && (
          <option data-testid={`${controlId}-option-all`} value="ALL">
            ALL
          </option>
        )}
        {options.map((c) => {
          const slug = `${c.buildingCode}-${c.roomNumber}`.replace(/ /g, "-");
          const key = `${controlId}-option-${slug}`;
          return (
            <option key={key} data-testid={key} value={c.roomNumber}>
              {c.buildingCode} {c.roomNumber}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default SingleClassroomDropdown;