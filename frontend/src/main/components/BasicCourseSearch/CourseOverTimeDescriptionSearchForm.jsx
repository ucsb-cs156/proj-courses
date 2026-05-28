import { useState } from "react";
import { Form, Button, Container, Row, Col, FormCheck } from "react-bootstrap";
import { quarterRange } from "main/utils/quarterUtilities";
import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";

const CourseOverTimeDescriptionSearchForm = ({ fetchJSON }) => {
  const { data: systemInfo } = useSystemInfo();

  // Don't confuse the startQtr and endQtr which are the system defaults
  // for the first and last values in the dropdown lists, with the actual
  // *currently selectted* start and end quarters for the search!

  const firstQtr = systemInfo?.startQtrYYYYQ || "20211";
  const lastQtr = systemInfo?.endQtrYYYYQ || "20214";

  const quarters = quarterRange(firstQtr, lastQtr);

  const localStartQuarter = localStorage.getItem(
    "CourseOverTimeDescriptionSearch.StartQuarter",
  );

  const localEndQuarter = localStorage.getItem(
    "CourseOverTimeDescriptionSearch.EndQuarter",
  );
  const localSearchTerms = localStorage.getItem(
    "CourseOverTimeDescriptionSearch.SearchTerms",
  );
  const localStorageLectureOnly =
    localStorage.getItem("CourseOverTimeDescriptionSearch.LectureOnly") ===
    "true";

  const [startQuarter, setStartQuarter] = useState(
    localStartQuarter || firstQtr,
  );

  // Stryker disable next-line all : TODO: write a good test for this or refactor
  const [endQuarter, setEndQuarter] = useState(localEndQuarter || lastQtr);

  const [searchTerms, setSearchTerms] = useState(localSearchTerms || "");
  const [lectureOnly, setLectureOnly] = useState(
    localStorageLectureOnly || false,
  );

  const handleStartQuarterChange = (quarter) => {
    setStartQuarter(quarter);
    localStorage.setItem(
      "CourseOverTimeDescriptionSearch.StartQuarter",
      quarter,
    );
  };

  const handleEndQuarterChange = (quarter) => {
    setEndQuarter(quarter);
    localStorage.setItem("CourseOverTimeDescriptionSearch.EndQuarter", quarter);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem(
      "CourseOverTimeDescriptionSearch.SearchTerms",
      searchTerms,
    );
    fetchJSON(event, { startQuarter, endQuarter, searchTerms, lectureOnly });
  };

  const handleSearchTermsOnChange = (event) => {
    setSearchTerms(event.target.value);
  };

  const handleLectureOnlyOnChange = (event) => {
    setLectureOnly(event.target.checked);
    localStorage.setItem(
      "CourseOverTimeDescriptionSearch.LectureOnly",
      event.target.checked.toString(),
    );
  };

  const testid = "CourseOverTimeDescriptionSearchForm";

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={startQuarter}
              setQuarter={handleStartQuarterChange}
              controlId={"CourseOverTimeDescriptionSearch.StartQuarter"}
              label={"Start Quarter"}
            />
          </Col>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={endQuarter}
              setQuarter={handleEndQuarterChange}
              controlId={"CourseOverTimeDescriptionSearch.EndQuarter"}
              label={"End Quarter"}
            />
          </Col>
        </Row>
        <Form.Group controlId="CourseOverTimeDescriptionSearch.SearchTerms">
          <Form.Label>Search Terms</Form.Label>
          <Form.Control
            onChange={handleSearchTermsOnChange}
            value={searchTerms}
          />
        </Form.Group>
        <Form.Group controlId="CourseOverTimeDescriptionSearch.LectureOnly">
          <FormCheck
            data-testid={`${testid}-checkbox`}
            label="Lectures Only"
            onChange={handleLectureOnlyOnChange}
            checked={lectureOnly}
          ></FormCheck>
        </Form.Group>
        <Row
          data-testid={`${testid}-bottom-row`}
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

export default CourseOverTimeDescriptionSearchForm;
