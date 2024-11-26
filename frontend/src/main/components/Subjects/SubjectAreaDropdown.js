import { compareValues } from "main/utils/sortHelper";
import React, { useState } from "react";
import { Form } from "react-bootstrap";

const SubjectAreaDropdown = ({
  subjects,
  subject,
  setSubject,
  controlId,
  onChange = null,
  label = "Subject Area",
}) => {
  const localSearchSubject = localStorage.getItem(controlId);

  const [subjectState, setSubjectState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchSubject || subject || "ALL",
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
        <option data-testid={`${controlId}-option-all`} value="ALL">
          All Subjects
        </option>
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

export default SubjectAreaDropdown;
