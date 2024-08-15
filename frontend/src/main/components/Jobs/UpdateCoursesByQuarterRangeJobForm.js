import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { quarterRange } from "main/utils/quarterUtilities";

import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import IfStaleCheckBox from "main/components/Jobs/IfStaleCheckBox";

const UpdateCoursesByQuarterRangeJobForm = ({ callback }) => {
  const formId = "UpdateCoursesByQuarterRangeJobForm";
  const { data: systemInfo } = useSystemInfo();

  // Stryker disable OptionalChaining
  const startQtr = systemInfo?.startQtrYYYYQ;
  const endQtr = systemInfo?.endQtrYYYYQ;
  // Stryker enable OptionalChaining

  if (!startQtr || !endQtr) {
    return <p>Loading...</p>;
  }
  const quarters = quarterRange(startQtr, endQtr);

  // Stryker disable all : not sure how to test/mock local storage
  const localStartQuarter = localStorage.getItem("BasicSearch.StartQuarter");
  const localEndQuarter = localStorage.getItem("BasicSearch.EndQuarter");

  const [startQuarter, setStartQuarter] = useState(
    localStartQuarter || quarters[0].yyyyq,
  );
  const [endQuarter, setEndQuarter] = useState(
    localEndQuarter || quarters[quarters.length-1].yyyyq,
  );
  const [ifStale, setIfStale] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    callback({ startQuarter, endQuarter, ifStale });
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
              quarter={startQuarter}
              setQuarter={setStartQuarter}
              controlId={`${formId}.StartQuarter`}
              label={"Start Quarter"}
            />
          </Col>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={endQuarter}
              setQuarter={setEndQuarter}
              controlId={`${formId}.EndQuarter`}
              label={"End Quarter"}
            />
          </Col>
          <Col>
            <IfStaleCheckBox
              controlId={`${formId}.IfStale`}
              ifStale={ifStale}
              setIfStale={setIfStale}
            />
          </Col>
        </Row>
        <Row style={padding}>
          <Col md="auto">
            <Button
              variant="primary"
              type="submit"
              data-testid="updateCoursesByQuarterRange"
            >
              Update Courses
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default UpdateCoursesByQuarterRangeJobForm;
