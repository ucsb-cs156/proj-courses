import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

//import { allTheLevels } from "fixtures/levelsFixtures";
import { quarterRange } from "main/utils/quarterUtilities";

import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import SingleSubjectDropdown from "../Subjects/SingleSubjectDropdown";
//import SingleLevelDropdown from "../Levels/SingleLevelDropdown";
import { useBackend  } from "main/utils/useBackend";

const CourseOverTimeSearchForm = ({ fetchJSON }) => {

  const { data: systemInfo } = useSystemInfo();

  // Stryker disable OptionalChaining
  const startQtr = systemInfo?.startQtrYYYYQ || "20211";
  const endQtr = systemInfo?.endQtrYYYYQ || "20214";
  // Stryker enable OptionalChaining

  const quarters = quarterRange(startQtr, endQtr);

  // Stryker disable all : not sure how to test/mock local storage
  const localStartQuarter = localStorage.getItem("CourseOverTimeSearch.StartQuarter");
  const localEndQuarter = localStorage.getItem("CourseOverTimeSearch.EndQuarter");
  const localSubject = localStorage.getItem("CourseOverTimeSearch.Subject");
  const localCourseNumber = localStorage.getItem("CourseOverTimeSearch.CourseNumber");

  const { data: subjects, error: _error, status: _status } =
  useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/UCSBSubjects/all"], 
    { method: "GET", url: "/api/UCSBSubjects/all" }, 
    []
  );

  const defaultSubjectArea =  "ANTH";

  const [startQuarter, setStartQuarter] = useState(localStartQuarter || quarters[0].yyyyq);
  const [endQuarter, setEndQuarter] = useState(localEndQuarter || quarters[0].yyyyq);
  const [subject, setSubject] = useState(localSubject || subjects[0]?.subjectCode || defaultSubjectArea );
  const [courseNumber, setCourseNumber] = useState(localCourseNumber || "");
  const [courseSuf, setCourseSuf] = useState("");
    
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { startQuarter, endQuarter, subject, courseNumber, courseSuf });
  };

  const handleCourseNumberOnChange = (event) => {
    const rawCourse = event.target.value;
    if (rawCourse.match(/\d+/g) != null) {
        const number = rawCourse.match(/\d+/g)[0];
        setCourseNumber(number);
    } else {
        setCourseNumber("");
    }
    
    if (rawCourse.match(/[a-zA-Z]+/g) != null) {
        const suffix = rawCourse.match(/[a-zA-Z]+/g)[0];
        setCourseSuf(suffix);
    } else {
        setCourseSuf("");
    }
};


  // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better
  return (
    <Form onSubmit={handleSubmit}>
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
            <Form.Control onChange={handleCourseNumberOnChange} defaultValue={courseNumber} />
        </Form.Group>
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

export default CourseOverTimeSearchForm;