import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { quarterRange } from "main/utils/quarterUtilities";

import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";

const UpdateCoursesByQuarterJobForm = ({ callback }) => {
  const { data: systemInfo } = useSystemInfo();

  // Stryker disable OptionalChaining
  const startQtr = systemInfo?.startQtrYYYYQ || "20211";
  const endQtr = systemInfo?.endQtrYYYYQ || "20214";
  // Stryker enable OptionalChaining

  const quarters = quarterRange(startQtr, endQtr);

  // Stryker disable all : not sure how to test/mock local storage
  const localQuarter = localStorage.getItem("BasicSearch.Quarter");
  // Stryker enable all

  const [quarter, setQuarter] = useState(localQuarter || quarters[0].yyyyq);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("UpdateCoursesJobForm: quarter", quarter);
    callback({ quarter });
  };

  // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better
  const padding = { paddingTop: 10, paddingBottom: 10 };
  // Stryker enable all

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={quarter}
              setQuarter={setQuarter}
              controlId={"BasicSearch.Quarter"}
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
        </Row>
      </Container>
    </Form>
  );
};

export default UpdateCoursesByQuarterJobForm;
