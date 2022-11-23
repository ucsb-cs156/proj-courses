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

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

function PersonalScheduleDropdown({
  schedules,
  setSchedule,
  controlId,
  onChange = null,
  label = stryMutAct_9fa48("187") ? "" : (stryCov_9fa48("187"), "Schedule")
}) {
  if (stryMutAct_9fa48("188")) {
    {}
  } else {
    stryCov_9fa48("188");
    const localSearchSchedule = localStorage.getItem(controlId);
    const [scheduleState, setScheduleState] = useState( // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchSchedule || {});

    const handleScheduleOnChange = event => {
      if (stryMutAct_9fa48("192")) {
        {}
      } else {
        stryCov_9fa48("192");
        const selectedSchedule = event.target.value;
        localStorage.setItem(controlId, selectedSchedule);
        setScheduleState(selectedSchedule);
        setSchedule(selectedSchedule);

        if (stryMutAct_9fa48("195") ? onChange == null : stryMutAct_9fa48("194") ? false : stryMutAct_9fa48("193") ? true : (stryCov_9fa48("193", "194", "195"), onChange != null)) {
          if (stryMutAct_9fa48("196")) {
            {}
          } else {
            stryCov_9fa48("196");
            onChange(event);
          }
        }
      }
    };

    return <Form.Group controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Control as="select" value={scheduleState} onChange={handleScheduleOnChange}>
                {schedules.map(function (object, i) {
          if (stryMutAct_9fa48("197")) {
            {}
          } else {
            stryCov_9fa48("197");
            const key = stryMutAct_9fa48("198") ? `` : (stryCov_9fa48("198"), `${controlId}-option-${i}`);
            return <option key={key} data-testid={key} value={object.id}>
                            {object.name}
                        </option>;
          }
        })}
            </Form.Control>
        </Form.Group>;
  }
}

;
export default PersonalScheduleDropdown;