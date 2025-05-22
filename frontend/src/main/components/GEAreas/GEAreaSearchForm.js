import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { quarterRange } from "main/utils/quarterUtilities";

import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import { useBackend } from "main/utils/useBackend";

const GEAreaSearchForm = ({ fetchJSON }) => {
  const { data: systemInfo } = useSystemInfo();
  const startQtr = systemInfo?.startQtrYYYYQ || "20231";
  const endQtr = systemInfo?.endQtrYYYYQ || "20253";
  const quarters = quarterRange(startQtr, endQtr);

  // Stryker disable all : not sure how to test/mock local storage
  const localQuarter = localStorage.getItem("GEAreaSearch.Quarter");
  const localArea = localStorage.getItem("GEAreaSearch.Area");

  const {
    data: areas = [],
    _error,
    _status,
  } = useBackend(
    ["/api/public/generalEducationInfo"],
    { method: "GET", url: "/api/public/generalEducationInfo" },
    [],
  );

  const areaCodes = areas.map((r) => r.requirementCode);
  const [quarter, setQuarter] = useState(localQuarter || quarters[0].yyyyq);
  const [area, setArea] = useState(localArea || "");

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem("GEAreaSearch.Quarter", quarter);
    localStorage.setItem("GEAreaSearch.Area", area);
    fetchJSON(event, { quarter, area });
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
              controlId={"GEAreaSearch.Quarter"}
            />
            <Form.Group controlId="GEAreaSearch.Area">
              <Form.Label>General Education Area</Form.Label>
              <Form.Control
                as="select"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              >
                <option data-testid="GEAreaSearch.Area-option-all" value="ALL">
                  ALL
                </option>
                {areaCodes.map((code) => {
                  const testid = `GEAreaSearch.Area-option-${code}`;
                  return (
                    <option key={code} data-testid={testid} value={code}>
                      {code}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
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

export default GEAreaSearchForm;
