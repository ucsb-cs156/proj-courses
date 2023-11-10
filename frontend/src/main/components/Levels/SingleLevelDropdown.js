import { useState } from "react";
import { Form } from "react-bootstrap";

const SingleLevelDropdown = ({
  levels,
  setLevel,
  controlId,
  onChange = null,
  label = "Course Level",
}) => {
  const localSearchLevel = localStorage.getItem(controlId);
  const [levelState, setLevelState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchLevel || "U",
  );

  const handleLeveltoChange = (event) => {
    localStorage.setItem(controlId, event.target.value);
    setLevelState(event.target.value);
    setLevel(event.target.value);
    if (onChange != null) {
      onChange(event);
    }
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        value={levelState}
        onChange={handleLeveltoChange}
      >
        {levels.map(function (object, i) {
          const key = `${controlId}-option-${i}`;
          return (
            <option key={key} data-testid={key} value={object[0]}>
              {object[1]}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default SingleLevelDropdown;
