import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { standardQuarterRange } from "main/utils/quarterUtilities";

import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import IfStaleCheckBox from "main/components/Jobs/IfStaleCheckBox";

const UpdateCoursesByQuarterJobForm = ({ callback }) => {
  const quarters = standardQuarterRange();
  const [quarter, setQuarter] = useState(quarters[0].yyyyq);
  const [ifStale, setIfStale] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    callback({ quarter, ifStale });
  };

  // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better
  const padding = { paddingTop: 10, paddingBottom: 10 };
  // Stryker restore all

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={quarter}
              setQuarter={setQuarter}
              controlId={"UpdateCoursesByQuarterJobForm.Quarter"}
            />
          </Col>
        </Row>
        <Row style={padding}>
          <Col md="auto">
            <Button
              variant="primary"
              type="submit"
              data-testid="updateCoursesByQuarter"
            >
              Update Courses
            </Button>
          </Col>
          <Col>
            <IfStaleCheckBox ifStale={ifStale} setIfStale={setIfStale} />
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default UpdateCoursesByQuarterJobForm;
