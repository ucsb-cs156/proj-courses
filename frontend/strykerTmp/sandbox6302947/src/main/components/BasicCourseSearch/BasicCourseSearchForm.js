// @ts-nocheck
function stryNS_9fa48() {
  var g = new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});

  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }

  function retrieveNS() {
    return ns;
  }

  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}

stryNS_9fa48();

function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });

  function cover() {
    var c = cov.static;

    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }

    var a = arguments;

    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }

  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}

function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();

  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }

      return true;
    }

    return false;
  }

  stryMutAct_9fa48 = isActive;
  return isActive(id);
}

import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { allTheLevels } from "fixtures/levelsFixtures";
import { quarterRange } from "main/utils/quarterUtilities";
import { useSystemInfo } from "main/utils/systemInfo";
import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import SingleSubjectDropdown from "../Subjects/SingleSubjectDropdown";
import SingleLevelDropdown from "../Levels/SingleLevelDropdown";
import PersonalScheduleDropdown from "../PersonalSchedules/PersonalScheduleDropdown";
import { useBackendMutation } from "main/utils/useBackend";
import { useBackend } from 'main/utils/useBackend';

const BasicCourseSearchForm = ({
  fetchJSON
}) => {
  if (stryMutAct_9fa48("0")) {
    {}
  } else {
    stryCov_9fa48("0");
    const {
      data: systemInfo
    } = useSystemInfo(); // Stryker disable OptionalChaining

    const startQtr = stryMutAct_9fa48("3") ? systemInfo?.startQtrYYYYQ && "20211" : stryMutAct_9fa48("2") ? false : stryMutAct_9fa48("1") ? true : (stryCov_9fa48("1", "2", "3"), systemInfo?.startQtrYYYYQ || (stryMutAct_9fa48("5") ? "" : (stryCov_9fa48("5"), "20211")));
    const endQtr = stryMutAct_9fa48("8") ? systemInfo?.endQtrYYYYQ && "20214" : stryMutAct_9fa48("7") ? false : stryMutAct_9fa48("6") ? true : (stryCov_9fa48("6", "7", "8"), systemInfo?.endQtrYYYYQ || (stryMutAct_9fa48("10") ? "" : (stryCov_9fa48("10"), "20214"))); // Stryker enable OptionalChaining

    const quarters = quarterRange(startQtr, endQtr); //Placeholder for what the dropdown option is supposed to be

    const {
      data: schedules,
      error: _error,
      status: _status
    } = useBackend( // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/personalschedules/all"], stryMutAct_9fa48("13") ? {} : (stryCov_9fa48("13"), {
      method: stryMutAct_9fa48("14") ? "" : (stryCov_9fa48("14"), "GET"),
      url: stryMutAct_9fa48("15") ? "" : (stryCov_9fa48("15"), "/api/personalschedules/all")
    }), stryMutAct_9fa48("16") ? ["Stryker was here"] : (stryCov_9fa48("16"), []));
    const new_schedules = stryMutAct_9fa48("17") ? ["Stryker was here"] : (stryCov_9fa48("17"), []);

    for (var i in schedules) {
      if (stryMutAct_9fa48("18")) {
        {}
      } else {
        stryCov_9fa48("18");
        new_schedules.push(stryMutAct_9fa48("19") ? {} : (stryCov_9fa48("19"), {
          id: i,
          name: schedules[i][0],
          description: schedules[i][1],
          quarter: schedules[i][2]
        }));
      }
    } // Stryker disable all : not sure how to test/mock local storage


    const localSubject = localStorage.getItem("BasicSearch.Subject");
    const localQuarter = localStorage.getItem("BasicSearch.Quarter");
    const localLevel = localStorage.getItem("BasicSearch.CourseLevel");
    const localSchedule = localStorage.getItem("BasicSearch.PersonalSchedules");

    const getObjectToAxiosParams = () => ({
      url: "/api/UCSBSubjects/all",
      method: "GET",
      params: {}
    });

    const onSuccess = listSubjects => {
      setSubjects(listSubjects);
    };

    const getMutation = useBackendMutation(getObjectToAxiosParams, {
      onSuccess
    }, // Stryker disable next-line all : hard to set up test for caching
    []);
    useEffect(() => {
      getMutation.mutate(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [quarter, setQuarter] = useState(localQuarter || quarters[0].yyyyq);
    const [subject, setSubject] = useState(localSubject || {});
    const [subjects, setSubjects] = useState([]);
    const [level, setLevel] = useState(localLevel || "U");
    const [schedule, setSchedule] = useState(localSchedule || 1);

    const handleSubmit = event => {
      event.preventDefault();
      fetchJSON(event, {
        quarter,
        subject,
        level,
        schedule
      });
    }; // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better


    return <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md="auto">
            <SingleQuarterDropdown quarters={quarters} quarter={quarter} setQuarter={setQuarter} controlId={"BasicSearch.Quarter"} />
          </Col>
          <Col md="auto">
            <SingleSubjectDropdown subjects={subjects} subject={subject} setSubject={setSubject} controlId={"BasicSearch.Subject"} />
          </Col>
          <Col md="auto">
            <SingleLevelDropdown levels={allTheLevels} level={level} setLevel={setLevel} controlId={"BasicSearch.Level"} />
          </Col>
          <Col md="auto">
            <PersonalScheduleDropdown schedules={new_schedules} schedule={schedule} setSchedule={setSchedule} controlId={"BasicSearch.PersonalSchedules"} />
          </Col>
        </Row>
        <Row style={{
          paddingTop: 10,
          paddingBottom: 10
        }}>
          <Col md="auto">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>;
  }
};

export default BasicCourseSearchForm;