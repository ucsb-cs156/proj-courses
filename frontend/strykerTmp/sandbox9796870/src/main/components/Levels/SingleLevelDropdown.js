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

import { useState } from "react";
import { Form } from "react-bootstrap";

const SingleLevelDropdown = ({
  levels,
  setLevel,
  controlId,
  onChange = null,
  label = stryMutAct_9fa48("105") ? "" : (stryCov_9fa48("105"), "Course Level")
}) => {
  if (stryMutAct_9fa48("106")) {
    {}
  } else {
    stryCov_9fa48("106");
    const localSearchLevel = localStorage.getItem(controlId);
    const [levelState, setLevelState] = useState( // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchLevel || "U");

    const handleLeveltoChange = event => {
      if (stryMutAct_9fa48("111")) {
        {}
      } else {
        stryCov_9fa48("111");
        localStorage.setItem(controlId, event.target.value);
        setLevelState(event.target.value);
        setLevel(event.target.value);

        if (stryMutAct_9fa48("114") ? onChange == null : stryMutAct_9fa48("113") ? false : stryMutAct_9fa48("112") ? true : (stryCov_9fa48("112", "113", "114"), onChange != null)) {
          if (stryMutAct_9fa48("115")) {
            {}
          } else {
            stryCov_9fa48("115");
            onChange(event);
          }
        }
      }
    };

    return <Form.Group controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Control as="select" value={levelState} onChange={handleLeveltoChange}>
                {levels.map(function (object, i) {
          if (stryMutAct_9fa48("116")) {
            {}
          } else {
            stryCov_9fa48("116");
            const key = stryMutAct_9fa48("117") ? `` : (stryCov_9fa48("117"), `${controlId}-option-${i}`);
            return <option key={key} data-testid={key} value={object[0]}>
                            {object[1]}
                        </option>;
          }
        })}
            </Form.Control>
        </Form.Group>;
  }
};

export default SingleLevelDropdown;