import React, { useState } from "react";
import { Form } from "react-bootstrap";

function SingleQuarterDropdown({
  quarter,
  quarters,
  setQuarter,
  controlId,
  onChange = null,
  label = "Quarter",
}) {
  const localSearchQuarter = localStorage.getItem(controlId);
  const lastIndex = quarters.length - 1;
  const defaultQuarter = quarters[lastIndex].yyyyq;

  if (!localSearchQuarter) {
    localStorage.setItem(controlId, defaultQuarter);
  }

  const [quarterState, setQuarterState] = useState(
    quarter.yyyq || localSearchQuarter || defaultQuarter,
  );

  const handleQuarterOnChange = (event) => {
    const selectedQuarter = event.target.value;
    localStorage.setItem(controlId, selectedQuarter);
    setQuarterState(selectedQuarter);
    setQuarter(selectedQuarter);
    if (onChange != null) {
      onChange(event);
    }
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        value={quarterState}
        onChange={handleQuarterOnChange}
      >
        {quarters.map(function (object, i) {
          const key = `${controlId}-option-${i}`;
          return (
            <option key={key} data-testid={key} value={object.yyyyq}>
              {object.qyy}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
}

export default SingleQuarterDropdown;
