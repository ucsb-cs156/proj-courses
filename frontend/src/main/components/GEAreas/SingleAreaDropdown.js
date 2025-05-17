import React, { _useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useBackend } from "main/utils/useBackend";

// A dropdown component for selecting General Education Areas
const SingleAreaDropdown = ({
  area,
  setArea,
  controlId,
  onChange = null,
  label = "GE Area",
  showAll = false,
}) => {
  const localSearchArea = localStorage.getItem(controlId);

  const [areaState, setAreaState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchArea || area,
  );

  const { data: areas, error: _error } = useBackend(
    // Stryker disable next-line all : can't test api calls
    ["/api/public/generalEducationInfo"],
    { method: "GET", url: "/api/public/generalEducationInfo" },
    [],
  );

  

  const handleAreaOnChange = (event) => {
    localStorage.setItem(controlId, event.target.value);
    setAreaState(event.target.value);
    setArea(event.target.value);
    if (onChange != null) {
      onChange(event);
    }
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" value={areaState} onChange={handleAreaOnChange}>
        {showAll && (
          <option data-testid={`${controlId}-option-all`} value="ALL">
            ALL
          </option>
        )}
        {areas &&
          areas.map((areaCode) => {
            const key = `${controlId}-option-${areaCode}`;
            return (
              <option key={key} data-testid={key} value={areaCode}>
                {areaCode}
              </option>
            );
          })}
      </Form.Control>
    </Form.Group>
  );
};

export default SingleAreaDropdown;
