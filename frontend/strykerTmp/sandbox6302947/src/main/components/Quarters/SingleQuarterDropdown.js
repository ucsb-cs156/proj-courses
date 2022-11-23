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
import { Form } from 'react-bootstrap'; // controlId is used to remember the value for localStorage,
// and for the testId, so it should be unique to at least any
// given page where the component is used.
// quarter and setQuarter should be values returned
// by a parent component's setState 
// quarters is an array of objects in this format
// [{ yyyyq :"20214", qyy: "F21"},
//  { yyyyq :"20221", qyy: "W22"}, 
//  { yyyyq :"20222", qyy: "S22"}] 

function SingleQuarterDropdown({
  quarters,
  setQuarter,
  controlId,
  onChange = null,
  label = stryMutAct_9fa48("273") ? "" : (stryCov_9fa48("273"), "Quarter")
}) {
  if (stryMutAct_9fa48("274")) {
    {}
  } else {
    stryCov_9fa48("274");
    const localSearchQuarter = localStorage.getItem(controlId);
    const [quarterState, setQuarterState] = useState( // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchQuarter || quarters[0].yyyyq);

    const handleQuarterOnChange = event => {
      if (stryMutAct_9fa48("278")) {
        {}
      } else {
        stryCov_9fa48("278");
        const selectedQuarter = event.target.value;
        localStorage.setItem(controlId, selectedQuarter);
        setQuarterState(selectedQuarter);
        setQuarter(selectedQuarter);

        if (stryMutAct_9fa48("281") ? onChange == null : stryMutAct_9fa48("280") ? false : stryMutAct_9fa48("279") ? true : (stryCov_9fa48("279", "280", "281"), onChange != null)) {
          if (stryMutAct_9fa48("282")) {
            {}
          } else {
            stryCov_9fa48("282");
            onChange(event);
          }
        }
      }
    };

    return <Form.Group controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Control as="select" value={quarterState} onChange={handleQuarterOnChange}>
                {quarters.map(function (object, i) {
          if (stryMutAct_9fa48("283")) {
            {}
          } else {
            stryCov_9fa48("283");
            const key = stryMutAct_9fa48("284") ? `` : (stryCov_9fa48("284"), `${controlId}-option-${i}`);
            return <option key={key} data-testid={key} value={object.yyyyq}>
                            {object.qyy}
                        </option>;
          }
        })}
            </Form.Control>
        </Form.Group>;
  }
}

;
export default SingleQuarterDropdown;