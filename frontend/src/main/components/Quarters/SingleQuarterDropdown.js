import React, { useState } from "react";
import { Form } from "react-bootstrap";

// controlId is used to remember the value for localStorage,
// and for the testId, so it should be unique to at least any
// given page where the component is used.

// quarter and setQuarter should be values returned
// by a parent component's setState

// quarters is an array of objects in this format
// [{ yyyyq :"20214", qyy: "F21"},
//  { yyyyq :"20221", qyy: "W22"},
//  { yyyyq :"20222", qyy: "S22"}]

function SingleQuarterDropdown({
  quarter, // initial value (can be null)
  quarters, // list of quarters
  setQuarter, // setState function to set the quarter
  controlId, // used for testid and localStorage
  label = "Quarter",
}) {


  const lastInd = quarters.length - 1;

  const localSearchQuarter = localStorage.getItem(controlId);

  if (!localSearchQuarter && quarters.length > 0) {
    localStorage.setItem(controlId, quarters[lastInd].yyyyq);
  }

  const quarterToUse = (quarter == null) ? (localSearchQuarter === null ? quarters[lastInd].yyyyq : localSearchQuarter) : quarter;
  const [quarterState, setQuarterState] = useState(quarterToUse);

  const handleQuarterOnChange = (event) => {
    const selectedQuarter = event.target.value;
    localStorage.setItem(controlId, selectedQuarter);
    setQuarterState(selectedQuarter);
    setQuarter(selectedQuarter);
  };


  if (quarters.length === 0) {
    return <p>Loading...</p>;
  }
  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        data-testid={controlId}
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
