import { Form } from "react-bootstrap";
import useLocalStorage from "main/utils/useLocalStorage";

// controlId is used to remember the value for localStorage,
// and for the testId, so it should be unique to at least any
// given page where the component is used.

// quarter and setQuarter should be values returned
// by a parent component's useState or useLocalStorage hook.
// quarter is a string in the format "20214"

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
}) {
  const [quarterState, setQuarterState] = useLocalStorage(
    controlId,
    quarter.yyyyq,
  );

  const handleQuarterOnChange = (event) => {
    const selectedQuarter = event.target.value;
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
