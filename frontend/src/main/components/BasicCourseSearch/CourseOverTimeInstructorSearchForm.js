import { useState } from "react";
import { Form, Button, Container, Row, Col, FormCheck } from "react-bootstrap";
import { quarterRange } from "main/utils/quarterUtilities";
import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";

const CourseOverTimeInstructorSearchForm = ({ fetchJSON }) => {

  const { data: systemInfo } = useSystemInfo();

  // Stryker disable OptionalChaining
  const startQtr = systemInfo?.startQtrYYYYQ || "20211";
  const endQtr = systemInfo?.endQtrYYYYQ || "20214";
  // Stryker restore OptionalChaining

  const quarters = quarterRange(startQtr, endQtr);

  // Stryker disable all : not sure how to test/mock local storage
  const localStartQuarter = localStorage.getItem("CourseOverTimeInstructorSearch.StartQuarter");
  const localEndQuarter = localStorage.getItem("CourseOverTimeInstructorSearch.EndQuarter");
  const localInstructor = localStorage.getItem("CourseOverTimeInstructorSearch.Instructor");
  const localStorageCheckbox = localStorage.getItem("CourseOverTimeInstructorSearch.Checkbox") === "true";
  

  const [startQuarter, setStartQuarter] = useState(localStartQuarter || quarters[0].yyyyq);
  const [endQuarter, setEndQuarter] = useState(localEndQuarter || quarters[0].yyyyq);
  const [instructor, setInstructor] = useState(localInstructor || "");
  const [checkbox, setCheckbox] = useState(localStorageCheckbox || false);
  // Stryker restore all

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { startQuarter, endQuarter, instructor, checkbox });
  };

  const handleInstructorOnChange = (event) => {
    setInstructor(event.target.value);
  };

  const handleCheckboxOnChange = (event) => {
    setCheckbox(event.target.checked);
    localStorage.setItem("CourseOverTimeInstructorSearch.Checkbox", event.target.checked.toString());
  };

  const testid = "CourseOverTimeInstructorSearchForm";

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={startQuarter}
              setQuarter={setStartQuarter}
              controlId={"CourseOverTimeInstructorSearch.StartQuarter"}
              label={"Start Quarter"}
            />
          </Col>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={endQuarter}
              setQuarter={setEndQuarter}
              controlId={"CourseOverTimeInstructorSearch.EndQuarter"}
              label={"End Quarter"}
            />
          </Col>
        </Row>
        <Form.Group controlId="CourseOverTimeInstructorSearch.Instructor">
            <Form.Label>Instructor Name</Form.Label>
            <Form.Control onChange={handleInstructorOnChange} defaultValue={instructor} />
        </Form.Group>
        <Form.Group controlId="CourseOverTimeInstructorSearch.Checkbox">
            <FormCheck data-testid={`${testid}-checkbox`} label="Lectures Only" onChange={handleCheckboxOnChange} checked={checkbox}></FormCheck>
        </Form.Group>
        <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Col md="auto">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default CourseOverTimeInstructorSearchForm;