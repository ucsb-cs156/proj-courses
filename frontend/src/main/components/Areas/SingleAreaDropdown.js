import { useState } from "react";
import { Form } from "react-bootstrap";

// showAll is defaulted to false, to ensure the "ALL" option
// doesn't showdown to pre-existing dropdowns

const SingleAreaDropdown = ({
  areas,
  setArea,
  controlId,
  onChange = null,
  label = "General Education Area",
  showAll = false,
}) => {
  const localSearchArea = localStorage.getItem(controlId);

  const [areaState, setAreaState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchArea || "A",
  );

  const handleAreatoChange = (event) => {
    localStorage.setItem(controlId, event.target.value);
    setAreaState(event.target.value);
    setArea(event.target.value);
    if (onChange != null) {
      onChange(event);
    }
  };

  // Remove duplicates from the areas array
  const uniqueAreas = Array.from(
    new Map(
      areas.map((item) => [
        `${item.requirementCode}-${item.collegeCode}`,
        item,
      ]),
    ).values(),
  );

  uniqueAreas.sort((a, b) =>
    a.requirementCode.localeCompare(b.requirementCode),
  );

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" value={areaState} onChange={handleAreatoChange}>
        {showAll && (
          <option data-testid={`${controlId}-option-all`} value="ALL">
            ALL
          </option>
        )}
        {uniqueAreas.map((object) => {
          const key = `${controlId}-option-${object.requirementCode}-${object.collegeCode}`;

          // Remove "-L&S" or "-Engr" from requirementTranslation if they exist
          const cleanedTranslation = object.requirementTranslation.replace(
            / - L&S| - Engr/gi,
            "",
          );

          return (
            <option
              key={key}
              data-testid={key}
              value={`${object.requirementCode}-${object.collegeCode}`}
            >
              {object.requirementCode} - {cleanedTranslation} (
              {object.collegeCode})
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default SingleAreaDropdown;
