import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import SingleAreaDropdown from "main/components/Areas/SingleAreaDropdown";
import SingleQuarterDropdown from "main/components/Quarters/SingleQuarterDropdown";

import { useBackend } from "main/utils/useBackend";
import { useSystemInfo } from "main/utils/systemInfo";
import { quarterRange } from "main/utils/quarterUtilities";

const GeneralEducationSearchForm = ({ fetchJSON }) => {
  // Stryker disable all : not sure how to test/mock local storage
  const localArea = localStorage.getItem("GeneralEducationSearch.Area");
  const localQuarter = localStorage.getItem("GeneralEducationSearch.Quarter");

  const { data: systemInfo } = useSystemInfo();
  const startQtr = systemInfo?.startQtrYYYYQ || "20211";
  const endQtr = systemInfo?.endQtrYYYYQ || "20214";
  const quarters = quarterRange(startQtr, endQtr);

  const {
    data: areas,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/public/generalEducationInfo"],
    { method: "GET", url: "/api/public/generalEducationInfo" },
    [],
  );

  const [area, setArea] = useState(localArea || "A");
  const [quarter, setQuarter] = useState(
    localQuarter || quarters[0]?.yyyyq || "20211",
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { area, quarter });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={quarter}
              setQuarter={setQuarter}
              controlId={"GeneralEducationSearch.Quarter"}
            />
          </Col>
          <Col md="auto">
            <SingleAreaDropdown
              areas={areas}
              area={area}
              setArea={setArea}
              controlId={"GeneralEducationSearch.Area"}
            />
          </Col>
        </Row>
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

export default GeneralEducationSearchForm;
