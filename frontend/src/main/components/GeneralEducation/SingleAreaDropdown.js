import React, { useState } from "react";
import { Form } from "react-bootstrap";

// showAll is defaulted to false, to ensure the "ALL" option
// doesn't showdown to pre-existing dropdowns

const SingleAreaDropdown = ({
  areas,
  area,
  setArea,
  controlId,
  onChange = null,
  label = "General Education Area",
  showAll = false,
}) => {
  const localGEArea = localStorage.getItem(controlId);

  const [areaState, setAreaState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localGEArea || area,
  );

  const handleAreaOnChange = (event) => {
    localStorage.setItem(controlId, event.target.value);
    setAreaState(event.target.value);
    setArea(event.target.value);
    if (onChange != null) {
      onChange(event);
    }
  };

  areas.sort((a, b) => {
    const codeCompare = a.requirementCode.localeCompare(b.requirementCode);
    if (codeCompare !== 0) return codeCompare;
    return a.collegeCode.localeCompare(b.collegeCode);
  });

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" value={areaState} onChange={handleAreaOnChange}>
        {showAll && (
          <option data-testid={`${controlId}-option-all`} value="ALL">
            ALL
          </option>
        )}
        {areas.map(function (object) {
          const areaCode = object.requirementCode;
          const key = `${controlId}-option-${areaCode}-${object.collegeCode}`;
          return (
            <option
              key={key}
              data-testid={key}
              value={object.requirementCode + "-" + object.collegeCode}
            >
              {object.requirementCode} - {object.requirementTranslation} (
              {object.collegeCode})
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default SingleAreaDropdown;
