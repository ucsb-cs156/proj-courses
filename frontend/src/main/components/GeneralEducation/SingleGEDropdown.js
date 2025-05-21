import React, { useState } from "react";
import { Form } from "react-bootstrap";

// showAll is defaulted to false, to ensure the "ALL" option
// doesn't showdown to pre-existing dropdowns

const SingleGEDropdown = ({
  areas = [],
  area,
  setArea,
  controlId,
  onChange = null,
  label = "GE Area",
  showAll = false,
}) => {
  const localSearchArea = localStorage.getItem(controlId);

  const [AreaState, setAreaState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchArea || area,
  );

  const handleAreaOnChange = (event) => {
    localStorage.setItem(controlId, event.target.value);
    setAreaState(event.target.value);
    setArea(event.target.value);
    if (onChange != null) {
      onChange(event);
    }
  };

  areas.sort((a, b) => a.requirementCode.localeCompare(b.requirementCode));

  areas.sort();

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" value={AreaState} onChange={handleAreaOnChange}>
        {showAll && (
          <option data-testid={`${controlId}-option-all`} value="ALL">
            ALL
          </option>
        )}
        {areas.map(({ requirementCode }) => {
          const key = `${controlId}-option-${requirementCode}`;
          return (
            <option key={key} data-testid={key} value={requirementCode}>
              {requirementCode}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default SingleGEDropdown;
