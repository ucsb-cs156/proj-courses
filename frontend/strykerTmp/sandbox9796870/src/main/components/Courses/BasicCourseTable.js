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

import React from "react";
import OurTable from "main/components/OurTable";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
export default function BasicCourseTable({
  courses
}) {
  if (stryMutAct_9fa48("40")) {
    {}
  } else {
    stryCov_9fa48("40");
    const columns = stryMutAct_9fa48("41") ? [] : (stryCov_9fa48("41"), [stryMutAct_9fa48("42") ? {} : (stryCov_9fa48("42"), {
      Header: stryMutAct_9fa48("43") ? "" : (stryCov_9fa48("43"), 'Quarter'),
      accessor: stryMutAct_9fa48("44") ? () => undefined : (stryCov_9fa48("44"), (row, _rowIndex) => yyyyqToQyy(row.quarter)),
      id: stryMutAct_9fa48("45") ? "" : (stryCov_9fa48("45"), 'quarter')
    }), stryMutAct_9fa48("46") ? {} : (stryCov_9fa48("46"), {
      Header: stryMutAct_9fa48("47") ? "" : (stryCov_9fa48("47"), 'Course Id'),
      accessor: stryMutAct_9fa48("48") ? "" : (stryCov_9fa48("48"), 'courseId')
    }), stryMutAct_9fa48("49") ? {} : (stryCov_9fa48("49"), {
      Header: stryMutAct_9fa48("50") ? "" : (stryCov_9fa48("50"), 'Title'),
      accessor: stryMutAct_9fa48("51") ? "" : (stryCov_9fa48("51"), 'title')
    }), stryMutAct_9fa48("52") ? {} : (stryCov_9fa48("52"), {
      Header: stryMutAct_9fa48("53") ? "" : (stryCov_9fa48("53"), 'Description'),
      accessor: stryMutAct_9fa48("54") ? "" : (stryCov_9fa48("54"), 'description')
    }), stryMutAct_9fa48("55") ? {} : (stryCov_9fa48("55"), {
      Header: stryMutAct_9fa48("56") ? "" : (stryCov_9fa48("56"), 'Level Code'),
      accessor: stryMutAct_9fa48("57") ? "" : (stryCov_9fa48("57"), 'objLevelCode')
    }), stryMutAct_9fa48("58") ? {} : (stryCov_9fa48("58"), {
      Header: stryMutAct_9fa48("59") ? "" : (stryCov_9fa48("59"), 'Subject Area'),
      accessor: stryMutAct_9fa48("60") ? "" : (stryCov_9fa48("60"), 'subjectArea')
    }), stryMutAct_9fa48("61") ? {} : (stryCov_9fa48("61"), {
      Header: stryMutAct_9fa48("62") ? "" : (stryCov_9fa48("62"), 'Units'),
      accessor: stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), 'unitsFixed')
    })]);
    return <OurTable data={courses} columns={columns} testid={stryMutAct_9fa48("64") ? "" : (stryCov_9fa48("64"), "BasicCourseTable")} />;
  }
}
;