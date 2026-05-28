import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { quarterRange } from "main/utils/quarterUtilities";

import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import { useBackend } from "main/utils/useBackend";
import { yyyyqToQyy } from "main/utils/quarterUtilities";
import { deduplicateAreaCodes } from "./geAreaSearchFormUtils";

const GEAreaSearchForm = ({ fetchJSON }) => {
  const { data: systemInfo } = useSystemInfo();

  // Stryker disable OptionalChaining
  const startQtr = systemInfo?.startQtrYYYYQ || "20221";
  const endQtr = systemInfo?.endQtrYYYYQ || "20222";
  // Stryker enable OptionalChaining

  const quarters = quarterRange(startQtr, endQtr);

  const quarterKey = "GEAreaSearch.Quarter";
  const areaKey = "GEAreaSearch.Area";

  const localQuarter = localStorage.getItem(quarterKey);
  const localArea = localStorage.getItem(areaKey);

  const {
    data: areas,
    _error,
    _status,
  } = useBackend(
    ["/api/public/generalEducationInfo"],
    { method: "GET", url: "/api/public/generalEducationInfo" },
    [
      {
        requirementCode: "A1",
        requirementTranslation: "English Reading & Composition",
        collegeCode: "ENGR",
        objCode: "BS",
        courseCount: 1,
        units: 4,
        inactive: false,
      },
    ],
  );

  const areaCodes = deduplicateAreaCodes(areas);
  const [quarter, setQuarter] = useState(
    localQuarter || quarters[0]?.yyyyq || startQtr,
  );
  const [area, setArea] = useState(localArea || "");
  const effectiveArea = area || areaCodes[0] || "";

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem(quarterKey, quarter);
    localStorage.setItem(areaKey, effectiveArea);
    fetchJSON(event, { quarter, area: effectiveArea });
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
              controlId={quarterKey}
            />
            <Form.Group controlId={areaKey}>
              <Form.Label>General Education Area</Form.Label>
              <Form.Control
                as="select"
                value={effectiveArea}
                onChange={(e) => setArea(e.target.value)}
              >
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
        <Row className="my-2" data-testid="GEAreaSearch.ButtonRow">
          <Col md="auto">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
          <Col>
            <p data-testid="GEAreaSearch.Status">
              Searching for {effectiveArea} in {yyyyqToQyy(quarter)}
            </p>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default GEAreaSearchForm;
