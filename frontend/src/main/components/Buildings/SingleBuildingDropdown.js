import { useState } from "react";
import { Form } from "react-bootstrap";

const SingleBuildingDropdown = ({
  buildings,
  setBuilding,
  controlId,
  onChange = null,
  label = "Building Name",
}) => {
  const localSearchBuilding = localStorage.getItem(controlId);
  const [buildingState, setBuildingState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchBuilding || "U",
  );

  const handleBuildingtoChange = (event) => {
    localStorage.setItem(controlId, event.target.value);
    setBuildingState(event.target.value);
    setBuilding(event.target.value);
    if (onChange != null) {
      onChange(event);
    }
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        value={buildingState}
        onChange={handleBuildingtoChange}
      >
        {buildings.map(function (object, i) {
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

export default SingleBuildingDropdown;
