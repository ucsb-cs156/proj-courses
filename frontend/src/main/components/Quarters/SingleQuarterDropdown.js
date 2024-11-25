import React, { useState } from "react";
import { Form } from "react-bootstrap";

// controlId is used to remember the value for localStorage,
// and for the testId, so it should be unique to at least any
// given page where the component is used.

// quarter and setQuarter should be values returned
// by a parent component's setState

// showAll is defaulted to false, to ensure the "ALL" option
// doesn't showdown to pre-existing dropdowns

// quarters is an array of objects in this format
// [{ yyyyq :"20214", qyy: "F21"},
//  { yyyyq :"20221", qyy: "W22"},
//  { yyyyq :"20222", qyy: "S22"}]

function SingleQuarterDropdown({
  quarter,
  quarters,
  setQuarter,
  controlId,
  onChange = null,
  label = "Quarter",
  showAll = false,
}) {
  const lastInd = quarters.length - 1;

  const localSearchQuarter = localStorage.getItem(controlId);

  if (!localSearchQuarter) {
    localStorage.setItem(controlId, quarters[lastInd].yyyyq);
  }

  const [quarterState, setQuarterState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    quarter.yyyyq || localSearchQuarter || quarters[lastInd].yyyyq,
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
        data-testid={controlId}
        as="select"
        value={quarterState}
        onChange={handleQuarterOnChange}
      >
        {showAll && (
          <option data-testid={`${controlId}-option-all`} value="ALL">
            ALL
          </option>
        )}
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
