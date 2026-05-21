import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { quarterRange, yyyyqToQyy } from "main/utils/quarterUtilities";

import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import SingleSubjectDropdown from "../Subjects/SingleSubjectDropdown";
import { useBackend } from "main/utils/useBackend";

import {
  getCourseNumber,
  getSuffix,
  courseNumRegex,
} from "main/utils/courseNumberUtilities";

const EnrollmentHistorySearchForm = ({ fetchJSON }) => {
  const { data: systemInfo } = useSystemInfo();

  const startQtr = systemInfo?.startQtrYYYYQ || "20211";
  const endQtr = systemInfo?.endQtrYYYYQ || "20214";

  const quarters = quarterRange(startQtr, endQtr);

  const localQuarter = localStorage.getItem(
    "EnrollmentHistorySearch.Quarter",
  );
  const localSubject = localStorage.getItem("EnrollmentHistorySearch.Subject");

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

  const [quarter, setQuarter] = useState(
    localQuarter || quarters[0].yyyyq,
  );
  const [subject, setSubject] = useState(
    localSubject || subjects[0]?.subjectCode || defaultSubjectArea,
  );
  const [courseNumber, setCourseNumber] = useState("");
  const [courseSuf, setCourseSuf] = useState("");

  const submitAction = (event) => {
    fetchJSON(event, {
      quarter,
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

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <Form
      onSubmit={handleSubmit(submitAction)}
      data-testid="EnrollmentHistorySearchForm"
    >
      <Container>
        <Row>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={quarter}
              setQuarter={setQuarter}
              controlId={"EnrollmentHistorySearch.Quarter"}
              label={"Quarter"}
            />
          </Col>
          <Col md="auto">
            <SingleSubjectDropdown
              subjects={subjects}
              subject={subject}
              setSubject={setSubject}
              controlId={"EnrollmentHistorySearch.Subject"}
              label={"Subject Area"}
            />
          </Col>
          <Col>
            <Form.Group controlId="EnrollmentHistorySearchCourseNumber">
              <Form.Label>Course Number</Form.Label>
              <Form.Control
                isInvalid={Boolean(errors.EnrollmentHistorySearchCourseNumber)}
                {...register("EnrollmentHistorySearchCourseNumber", {
                  pattern: courseNumRegex,
                  onChange: (e) => handleCourseNumberOnChange(e), // Here's the fix!
                })}
              />
              <Form.Text muted>
                {"For example: '16' or '130A'; omit the subject area prefix."}
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {errors.EnrollmentHistorySearchCourseNumber &&
                  "Course Number is required. "}
                {errors.EnrollmentHistorySearchCourseNumber?.type === "pattern" &&
                  "Course number should be a 1 to 3 digit number, optionally followed by up to two letters."}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="my-2" data-testid="EnrollmentHistorySearchForm.ButtonRow">
          <Col md="auto">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
          <Col md="auto">
            <p data-testid="EnrollmentHistorySearchForm.FullSearchString">
              Searching for:&nbsp;
              <code data-testid="EnrollmentHistorySearchForm.SearchString">{`${subject} ${courseNumber}${courseSuf}`}</code>
              &nbsp;for quarter {`${yyyyqToQyy(quarter)}`}
            </p>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default EnrollmentHistorySearchForm;