import { compareValues } from "main/utils/sortHelper";
import React, { useState } from "react";
import { Form } from "react-bootstrap";

// showAll is defaulted to false, to ensure the "ALL" option
// doesn't showdown to pre-existing dropdowns

const SingleSubjectDropdown = ({
  subjects,
  subject,
  setSubject,
  controlId,
  onChange = null,
  label = "Subject Area",
  showAll = false,
}) => {
  const localSearchSubject = localStorage.getItem(controlId);

  const [subjectState, setSubjectState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchSubject || subject,
  );

  const handleSubjectOnChange = (event) => {
    localStorage.setItem(controlId, event.target.value);
    setSubjectState(event.target.value);
    setSubject(event.target.value);
    if (onChange != null) {
      onChange(event);
    }
  };

  subjects.sort(compareValues("subjectCode"));

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        value={subjectState}
        onChange={handleSubjectOnChange}
      >
        {showAll && (
          <option data-testid={`${controlId}-option-all`} value="ALL">
            ALL
          </option>
        )}
        {subjects.map(function (object) {
          const subjectCode = object.subjectCode.replace(/ /g, "-");
          const key = `${controlId}-option-${subjectCode}`;
          return (
            <option key={key} data-testid={key} value={object.subjectCode}>
              {object.subjectCode} - {object.subjectTranslation}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default SingleSubjectDropdown;
