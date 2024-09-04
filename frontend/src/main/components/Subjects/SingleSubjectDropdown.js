import { compareValues } from "main/utils/sortHelper";
import { Form } from "react-bootstrap";
import useLocalStorage from "main/utils/useLocalStorage";

const SingleSubjectDropdown = ({
  subjects,
  subject,
  setSubject,
  controlId,
  onChange = null,
  label = "Subject Area",
}) => {
  const [subjectState, setSubjectState] = useLocalStorage(controlId, subject);
  console.log("subjectState=", subjectState, " subjects=", subjects);

  const handleSubjectOnChange = (event) => {
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
