import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";

const SingleClassroomDropdown = ({
  buildingCode,
  quarter,
  classroom,
  setClassroom,
  controlId,
  onChange = null,
  label = "Classroom",
  showAll = false,
}) => {
  const localSearchClassroom = localStorage.getItem(controlId);

  const [classroomState, setClassroomState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchClassroom || classroom,
  );

  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    if (buildingCode) {
      axios
        .get("/api/public/classrooms/roomnumbers", {
          params: { quarter, buildingCode },
        })
        .then((response) => {
          const sorted = [...response.data].sort((a, b) => a.localeCompare(b));
          setClassrooms(sorted);
        })
        .catch((error) => {
          console.error("Error fetching classrooms:", error);
        });
    }
  }, [buildingCode, quarter]);

  const handleClassroomOnChange = (event) => {
    localStorage.setItem(controlId, event.target.value);
    setClassroomState(event.target.value);
    setClassroom(event.target.value);
    if (onChange != null) {
      onChange(event);
    }
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        value={classroomState}
        onChange={handleClassroomOnChange}
      >
        <option value="">Select a classroom</option>
        {showAll && (
          <option data-testid={`${controlId}-option-all`} value="ALL">
            ALL
          </option>
        )}
        {classrooms.map((room) => {
          const key = `${controlId}-option-${room.replace(/ /g, "-")}`;
          return (
            <option key={key} data-testid={key} value={room}>
              {room}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default SingleClassroomDropdown;
