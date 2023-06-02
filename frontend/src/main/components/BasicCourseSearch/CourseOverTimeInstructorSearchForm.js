import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

//import { allTheLevels } from "fixtures/levelsFixtures";
import { quarterRange } from "main/utils/quarterUtilities";

import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
// import SingleSubjectDropdown from "../Subjects/SingleSubjectDropdown";
//import SingleLevelDropdown from "../Levels/SingleLevelDropdown";
// import { useBackend  } from "main/utils/useBackend";

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

  const [startQuarter, setStartQuarter] = useState(localStartQuarter || quarters[0].yyyyq);
  const [endQuarter, setEndQuarter] = useState(localEndQuarter || quarters[0].yyyyq);
  const [instructor, setInstructor] = useState(localInstructor || "");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { startQuarter, endQuarter, instructor });
  };

  const handleInstructorOnChange = (event) => {
    setInstructor(event.target.value);
};


  // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better
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