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
  // Initialize from localStorage, then from controlled prop, then empty string
  const [value, setValue] = useState(
    localStorage.getItem(controlId) || classroom || ""
  );

  // Ref to skip the reset effect on initial mount
  const isFirstRun = useRef(true);

  // Whenever the building prop changes _after_ mount, clear selection
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    // Remove stored value and reset both local and parent state
    localStorage.removeItem(controlId);
    setValue("");
    setClassroom("");
  }, [building]);

  const handleChange = (e) => {
    const v = e.target.value;
    localStorage.setItem(controlId, v);
    setValue(v);
    setClassroom(v);
    if (onChange) onChange(e);
  };

  // Either show all classrooms or only those matching the building, then sort
  const options = (
    showAll
      ? classrooms
      : classrooms.filter((c) => c.buildingCode === building)
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