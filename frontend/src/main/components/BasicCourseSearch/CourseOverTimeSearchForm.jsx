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
  const [courseNumber, setCourseNumber] = useState("");
  const [courseSuf, setCourseSuf] = useState("");

  const submitAction = (event) => {
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

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <Form
      onSubmit={handleSubmit(submitAction)}
      data-testid="CourseOverTimeSearchForm"
    >
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
          <Col>
            <Form.Group controlId="CourseOverTimeSearchCourseNumber">
              <Form.Label>Course Number</Form.Label>
              <Form.Control
                isInvalid={Boolean(errors.CourseOverTimeSearchCourseNumber)}
                {...register("CourseOverTimeSearchCourseNumber", {
                  pattern: courseNumRegex,
                  onChange: (e) => handleCourseNumberOnChange(e), // Here's the fix!
                })}
              />
              <Form.Text muted>
                For example: &apos;16&apos; or &apos;130A&apos;; omit the
                subject area prefix.
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {errors.CourseOverTimeSearchCourseNumber &&
                  "Course Number is required. "}
                {errors.CourseOverTimeSearchCourseNumber?.type === "pattern" &&
                  "Course number should be a 1 to 3 digit number, optionally followed by up to two letters."}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row className="my-2" data-testid="CourseOverTimeSearchForm.ButtonRow">
          <Col md="auto">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
          <Col md="auto">
            <p data-testid="CourseOverTimeSearchForm.FullSearchString">
              Searching for:&nbsp;
              <code data-testid="CourseOverTimeSearchForm.SearchString">{`${subject} ${courseNumber}${courseSuf}`}</code>
              for quarters {`${yyyyqToQyy(startQuarter)}`} through&nbsp;
              {`${yyyyqToQyy(endQuarter)}`}
            </p>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default CourseOverTimeSearchForm;
