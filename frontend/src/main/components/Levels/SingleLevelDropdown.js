import { Form } from "react-bootstrap";
import useLocalStorage from "main/utils/useLocalStorage";

const SingleLevelDropdown = ({
  level,
  levels,
  setLevel,
  controlId,
  onChange = null,
  label = "Course Level",
}) => {
  const [levelState, setLevelState] = useLocalStorage(controlId, level);

  const handleLevelChange = (event) => {
    setLevel(event.target.value);
    setLevelState(event.target.value);
    if (onChange != null) {
      onChange(event);
    }
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" value={levelState} onChange={handleLevelChange}>
        {levels.map(function (object, i) {
          const key = `${controlId}-option-${i}`;
          return (
            <option key={key} data-testid={key} value={object[0]}>
              {object[1]}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default SingleLevelDropdown;
