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

import { compareValues } from "main/utils/sortHelper";
import React, { useState } from "react";
import { Form } from "react-bootstrap";

const SingleSubjectDropdown = ({
  subjects,
  subject,
  setSubject,
  controlId,
  onChange = null,
  label = stryMutAct_9fa48("368") ? "" : (stryCov_9fa48("368"), "Subject Area")
}) => {
  if (stryMutAct_9fa48("369")) {
    {}
  } else {
    stryCov_9fa48("369");
    const localSearchSubject = localStorage.getItem(controlId);
    const [subjectState, setSubjectState] = useState( // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchSubject || subject);

    const handleSubjectOnChange = event => {
      if (stryMutAct_9fa48("373")) {
        {}
      } else {
        stryCov_9fa48("373");
        localStorage.setItem(controlId, event.target.value);
        setSubjectState(event.target.value);
        setSubject(event.target.value);

        if (stryMutAct_9fa48("376") ? onChange == null : stryMutAct_9fa48("375") ? false : stryMutAct_9fa48("374") ? true : (stryCov_9fa48("374", "375", "376"), onChange != null)) {
          if (stryMutAct_9fa48("377")) {
            {}
          } else {
            stryCov_9fa48("377");
            onChange(event);
          }
        }
      }
    };

    subjects.sort(compareValues(stryMutAct_9fa48("378") ? "" : (stryCov_9fa48("378"), "subjectCode")));
    return <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" value={subjectState} onChange={handleSubjectOnChange}>
        {subjects.map(function (object, i) {
          if (stryMutAct_9fa48("379")) {
            {}
          } else {
            stryCov_9fa48("379");
            const key = stryMutAct_9fa48("380") ? `` : (stryCov_9fa48("380"), `${controlId}-option-${i}`);
            return <option key={key} data-testid={key} value={object.subjectCode}>
              {object.subjectCode} - {object.subjectTranslation}
            </option>;
          }
        })}
      </Form.Control>
    </Form.Group>;
  }
};

export default SingleSubjectDropdown;