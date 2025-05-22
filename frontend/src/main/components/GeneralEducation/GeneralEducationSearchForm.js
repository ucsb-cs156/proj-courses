import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { quarterRange } from "main/utils/quarterUtilities";
import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import SingleGEDropdown from "./SingleGEDropdown";
import { useBackend } from "main/utils/useBackend";

const GeneralEducationSearchForm = ({ fetchJSON }) => {
  const { data: systemInfo } = useSystemInfo();

  // Stryker disable OptionalChaining
  const startQtr = systemInfo?.startQtrYYYYQ || "20211";
  const endQtr = systemInfo?.endQtrYYYYQ || "20214";
  // Stryker enable OptionalChaining

  const quarters = quarterRange(startQtr, endQtr);

  // Stryker disable all : not sure how to test/mock local storage
  const localQuarter = localStorage.getItem("BasicSearch.Quarter");
  const localGeneralEducation = localStorage.getItem(
    "GeneralEducationSearch.GEArea",
  );

  const {
    data: geAreas,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/public/generalEducationInfo"],
    { method: "GET", url: "/api/public/generalEducationInfo" },
    [],
  );

  const [quarter, setQuarter] = useState(localQuarter || quarters[0].yyyyq);
  const [geArea, setArea] = useState(localGeneralEducation || geAreas[0]);
  // Stryker restore all

  const handleGeneralEducationOnChange = (event) => {
    setArea(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { quarter, geArea });
  };

  //   const testid = "GeneralEducationSearchForm";

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={quarter}
              setQuarter={setQuarter}
              controlId={"GeneralEducationSearch.StartQuarter"}
              label={"Start Quarter"}
            />
          </Col>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={quarter}
              setQuarter={setQuarter}
              controlId={"GeneralEducationSearch.EndQuarter"}
              label={"End Quarter"}
            />
          </Col>
        </Row>
        <Form.Group controlId="GeneralEducationSearch.GEArea">
          <SingleGEDropdown
            areas={geAreas}
            area={geArea}
            setArea={setArea}
            onChange={handleGeneralEducationOnChange}
            controlId="GeneralEducationSearch.GEArea"
            label="GE Area"
          />
        </Form.Group>
        <Row
          data-testid="GeneralEducationSearchForm-submit-row"
          style={{ paddingTop: 10, paddingBottom: 10 }}
        >
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
