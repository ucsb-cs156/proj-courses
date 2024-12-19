import useLocalStorage from "main/utils/useLocalStorage";
import { Form } from "react-bootstrap";

const GenericDropdown = ({ values, setValue, controlId, label }) => {
  const [valueState, setValueState] = useLocalStorage(controlId, values[0]);

  const handleUpdateFieldChange = (event) => {
    localStorage.setItem(controlId, event.target.value);
    setValueState(event.target.value);
    setValue(event.target.value);
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        value={valueState}
        onChange={handleUpdateFieldChange}
      >
        {values.map(function (v, i) {
          const key = `${controlId}-option-${i}`;
          return (
            <option key={key} data-testid={key} value={v}>
              {v}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default GenericDropdown;
