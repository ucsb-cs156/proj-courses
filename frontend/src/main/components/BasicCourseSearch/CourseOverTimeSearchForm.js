import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { quarterRange } from "main/utils/quarterUtilities";

import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import SingleSubjectDropdown from "../Subjects/SingleSubjectDropdown";
import { useBackend } from "main/utils/useBackend";

import {getCourseNumber, getSuffix} from "main/utils/courseNumberUtilities";

const CourseOverTimeSearchForm = ({ fetchJSON }) => {
  const { data: systemInfo } = useSystemInfo();

  const startQtr = systemInfo?.startQtrYYYYQ || "20211";
  const endQtr = systemInfo?.endQtrYYYYQ || "20214";

  const quarters = quarterRange(startQtr, endQtr);

  const localStartQuarter = localStorage.getItem(
    "CourseOverTimeSearch.StartQuarter",
  );
  const localEndQuarter = localStorage.getItem(
    "CourseOverTimeSearch.EndQuarter",
  );
  const localSubject = localStorage.getItem("CourseOverTimeSearch.Subject");
  const localCourseNumber = localStorage.getItem(
    "CourseOverTimeSearch.CourseNumber",
  );

  const {
    data: subjects,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/UCSBSubjects/all"],
    {
      // Stryker disable next-line StringLiteral : GET is the default, so replacing with empty string is an equivalent mutation
      method: "GET",
      url: "/api/UCSBSubjects/all",
    },
    [],
  );

  const defaultSubjectArea = "ANTH";

  const [startQuarter, setStartQuarter] = useState(
    localStartQuarter || quarters[0].yyyyq,
  );
  const [endQuarter, setEndQuarter] = useState(
    localEndQuarter || quarters[0].yyyyq,
  );
  const [subject, setSubject] = useState(
    localSubject || subjects[0]?.subjectCode || defaultSubjectArea,
  );
  const [courseNumber, setCourseNumber] = useState(localCourseNumber || "");
  const [courseSuf, setCourseSuf] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, {
      startQuarter,
      endQuarter,
      subject,
      courseNumber,
      courseSuf,
    });
  };

  const handleCourseNumberOnChange = (event) => {
    const rawCourse = event.target.value;
    setCourseSuf(getSuffix(rawCourse));
    setCourseNumber(getCourseNumber(rawCourse));
  };

  return (
    <Form onSubmit={handleSubmit} data-testid="CourseOverTimeSearchForm">
      <Container>
        <Row>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={startQuarter}
              setQuarter={setStartQuarter}
              controlId={"CourseOverTimeSearch.StartQuarter"}
              label={"Start Quarter"}
            />
          </Col>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={endQuarter}
              setQuarter={setEndQuarter}
              controlId={"CourseOverTimeSearch.EndQuarter"}
              label={"End Quarter"}
            />
          </Col>
          <Col md="auto">
            <SingleSubjectDropdown
              subjects={subjects}
              subject={subject}
              setSubject={setSubject}
              controlId={"CourseOverTimeSearch.Subject"}
              label={"Subject Area"}
            />
          </Col>
        </Row>
        <Form.Group controlId="CourseOverTimeSearch.CourseNumber">
          <Form.Label>Course Number (Try searching '16' or '130A')</Form.Label>
          <Form.Control
            onChange={handleCourseNumberOnChange}
            defaultValue={courseNumber}
          />
        </Form.Group>
        <Row className="my-2" data-testid="CourseOverTimeSearchForm.ButtonRow">
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

export default CourseOverTimeSearchForm;
