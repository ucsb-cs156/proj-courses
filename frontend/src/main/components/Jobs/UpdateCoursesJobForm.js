import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { standardQuarterRange } from "main/utils/quarterUtilities";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import SingleSubjectDropdown from "../Subjects/SingleSubjectDropdown";
import { useBackend } from "main/utils/useBackend";
import IfStaleCheckBox from "main/components/Jobs/IfStaleCheckBox";

const UpdateCoursesJobForm = ({ callback }) => {
  const formId = "UpdateCoursesJobForm";
  const quarters = standardQuarterRange();

  // Stryker disable all : not sure how to test/mock local storage
  const localSubject = localStorage.getItem("BasicSearch.Subject");
  const localQuarter = localStorage.getItem("BasicSearch.Quarter");

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

  const [quarter, setQuarter] = useState(localQuarter || quarters[0].yyyyq);
  const [subject, setSubject] = useState(localSubject || "ANTH");
  const [ifStale, setIfStale] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    callback({ quarter, subject, ifStale });
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
              controlId={`${formId}.Quarter`}
            />
          </Col>
          <Col md="auto">
            <SingleSubjectDropdown
              subjects={subjects}
              subject={subject}
              setSubject={setSubject}
              controlId={`${formId}.Subject`}
            />
          </Col>
          <Col>
            <IfStaleCheckBox
              controlId={`${formId}.ifStale`}
              ifStale={ifStale}
              setIfStale={setIfStale}
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Col md="auto">
            <Button variant="primary" type="submit" data-testid="updateCourses">
              Update Courses
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default UpdateCoursesJobForm;
