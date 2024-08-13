import React from "react";
import { Form } from "react-bootstrap";

const IfStaleCheckBox = ({
  ifStale,
  setIfStale,
  controlId,
  onChange = null,
  label = "Update only if stale",
}) => {
  const handleOnChange = (event) => {
    setIfStale(event.target.checked);
    if (onChange != null) {
      onChange(event);
    }
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Check
        type="checkbox"
        id={controlId}
        defaultChecked={ifStale}
        onChange={handleOnChange}
      ></Form.Check>
    </Form.Group>
  );
};

export default IfStaleCheckBox;
