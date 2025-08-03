import { useState } from "react";
import { Form, Button, Container, Row, Col, FormCheck } from "react-bootstrap";
import { quarterRange } from "main/utils/quarterUtilities";
import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";

const CourseOverTimeInstructorSearchForm = ({ fetchJSON }) => {
  const { data: systemInfo } = useSystemInfo();

  // Don't confuse the startQtr and endQtr which are the system defaults
  // for the first and last values in the dropdown lists, with the actual
  // *currently selectted* start and end quarters for the search!

  const firstQtr = systemInfo.startQtrYYYYQ || "20211";
  const lastQtr = systemInfo.endQtrYYYYQ || "20214";

  const quarters = quarterRange(firstQtr, lastQtr);

  const localStartQuarter = localStorage.getItem(
    "CourseOverTimeInstructorSearch.StartQuarter",
  );
  // const localEndQuarter = localStorage.getItem(
  //   "CourseOverTimeInstructorSearch.EndQuarter",
  // );

  const localInstructor = localStorage.getItem(
    "CourseOverTimeInstructorSearch.Instructor",
  );
  const localStorageCheckbox =
    localStorage.getItem("CourseOverTimeInstructorSearch.Checkbox") === "true";

  const [startQuarter, setStartQuarter] = useState(
    localStartQuarter || firstQtr,
  );
  const [endQuarter, setEndQuarter] = useState(); // default is handled by SingleQuarterDropdown
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
    localStorage.setItem(
      "CourseOverTimeInstructorSearch.Checkbox",
      event.target.checked.toString(),
    );
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
          <Form.Control
            onChange={handleInstructorOnChange}
            defaultValue={instructor}
          />
        </Form.Group>
        <Form.Group controlId="CourseOverTimeInstructorSearch.Checkbox">
          <FormCheck
            data-testid={`${testid}-checkbox`}
            label="Lectures Only"
            onChange={handleCheckboxOnChange}
            checked={checkbox}
          ></FormCheck>
        </Form.Group>
        <Row data-testid={`${testid}-bottom-row`} style={{ paddingTop: 10, paddingBottom: 10 }}>
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
