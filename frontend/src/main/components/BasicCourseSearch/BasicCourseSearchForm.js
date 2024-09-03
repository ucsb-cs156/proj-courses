import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { allTheLevels } from "fixtures/levelsFixtures";
import { quarterRange } from "main/utils/quarterUtilities";

import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import SingleSubjectDropdown from "../Subjects/SingleSubjectDropdown";
import SingleLevelDropdown from "../Levels/SingleLevelDropdown";
import { useBackend } from "main/utils/useBackend";
import useLocalStorage from "main/utils/useLocalStorage";

const BasicCourseSearchForm = ({ fetchJSON }) => {
  const startQtr = process.env.REACT_APP_START_QTR || "20211";
  const endQtr = process.env.REACT_APP_END_QTR || "20214";
  const quarters = quarterRange(startQtr, endQtr);

  const {
    data: subjects,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/UCSBSubjects/all"],
    { method: "GET", url: "/api/UCSBSubjects/all" },
    [],
  );

  const [quarter, setQuarter] = useLocalStorage(
    "BasicSearch.Quarter",
    quarters[0].yyyyq,
  );
  const [subject, setSubject] = useLocalStorage(
    "BasicSearch.Subject",
    subjects[0]?.subjectCode || "ANTH",
  );
  const [level, setLevel] = useLocalStorage("BasicSearch.Level" || "U");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { quarter, subject, level });
  };

  // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better
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
          <Col md="auto">
            <SingleSubjectDropdown
              subjects={subjects}
              subject={subject}
              setSubject={setSubject}
              controlId={"BasicSearch.Subject"}
            />
          </Col>
          <Col md="auto">
            <SingleLevelDropdown
              levels={allTheLevels}
              level={level}
              setLevel={setLevel}
              controlId={"BasicSearch.Level"}
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

export default BasicCourseSearchForm;
