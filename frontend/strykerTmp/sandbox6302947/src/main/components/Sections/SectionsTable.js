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

import SectionsTableBase from "main/components/SectionsTableBase";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
import { convertToFraction, formatDays, formatInstructors, formatLocation, formatTime, isSection } from "main/utils/sectionUtils.js";

function getFirstVal(values) {
  if (stryMutAct_9fa48("285")) {
    {}
  } else {
    stryCov_9fa48("285");
    return values[0];
  }
}

;
export default function SectionsTable({
  sections
}) {
  if (stryMutAct_9fa48("286")) {
    {}
  } else {
    stryCov_9fa48("286");
    // Stryker enable all 
    // Stryker disable BooleanLiteral
    const columns = stryMutAct_9fa48("287") ? [] : (stryCov_9fa48("287"), [stryMutAct_9fa48("288") ? {} : (stryCov_9fa48("288"), {
      Header: stryMutAct_9fa48("289") ? "" : (stryCov_9fa48("289"), 'Quarter'),
      accessor: stryMutAct_9fa48("290") ? () => undefined : (stryCov_9fa48("290"), row => yyyyqToQyy(row.courseInfo.quarter)),
      disableGroupBy: true,
      id: stryMutAct_9fa48("292") ? "" : (stryCov_9fa48("292"), 'quarter'),
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("293") ? () => undefined : (stryCov_9fa48("293"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("294") ? `` : (stryCov_9fa48("294"), `${value}`))
    }), stryMutAct_9fa48("295") ? {} : (stryCov_9fa48("295"), {
      Header: stryMutAct_9fa48("296") ? "" : (stryCov_9fa48("296"), 'Course ID'),
      accessor: stryMutAct_9fa48("297") ? "" : (stryCov_9fa48("297"), 'courseInfo.courseId'),
      Cell: stryMutAct_9fa48("298") ? () => undefined : (stryCov_9fa48("298"), ({
        cell: {
          value
        }
      }) => value.substring(0, stryMutAct_9fa48("299") ? value.length + 2 : (stryCov_9fa48("299"), value.length - 2)))
    }), stryMutAct_9fa48("300") ? {} : (stryCov_9fa48("300"), {
      Header: stryMutAct_9fa48("301") ? "" : (stryCov_9fa48("301"), 'Title'),
      accessor: stryMutAct_9fa48("302") ? "" : (stryCov_9fa48("302"), 'courseInfo.title'),
      disableGroupBy: true,
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("304") ? () => undefined : (stryCov_9fa48("304"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("305") ? `` : (stryCov_9fa48("305"), `${value}`))
    }), stryMutAct_9fa48("306") ? {} : (stryCov_9fa48("306"), {
      // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
      Header: 'Is Section?',
      accessor: stryMutAct_9fa48("308") ? () => undefined : (stryCov_9fa48("308"), row => isSection(row.section.section)),
      // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
      id: 'isSection'
    }), stryMutAct_9fa48("310") ? {} : (stryCov_9fa48("310"), {
      Header: stryMutAct_9fa48("311") ? "" : (stryCov_9fa48("311"), 'Enrolled'),
      accessor: stryMutAct_9fa48("312") ? () => undefined : (stryCov_9fa48("312"), row => convertToFraction(row.section.enrolledTotal, row.section.maxEnroll)),
      disableGroupBy: true,
      id: stryMutAct_9fa48("314") ? "" : (stryCov_9fa48("314"), 'enrolled'),
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("315") ? () => undefined : (stryCov_9fa48("315"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("316") ? `` : (stryCov_9fa48("316"), `${value}`))
    }), stryMutAct_9fa48("317") ? {} : (stryCov_9fa48("317"), {
      Header: stryMutAct_9fa48("318") ? "" : (stryCov_9fa48("318"), 'Location'),
      accessor: stryMutAct_9fa48("319") ? () => undefined : (stryCov_9fa48("319"), row => formatLocation(row.section.timeLocations)),
      disableGroupBy: true,
      id: stryMutAct_9fa48("321") ? "" : (stryCov_9fa48("321"), 'location'),
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("322") ? () => undefined : (stryCov_9fa48("322"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("323") ? `` : (stryCov_9fa48("323"), `${value}`))
    }), stryMutAct_9fa48("324") ? {} : (stryCov_9fa48("324"), {
      Header: stryMutAct_9fa48("325") ? "" : (stryCov_9fa48("325"), 'Days'),
      accessor: stryMutAct_9fa48("326") ? () => undefined : (stryCov_9fa48("326"), row => formatDays(row.section.timeLocations)),
      disableGroupBy: true,
      id: stryMutAct_9fa48("328") ? "" : (stryCov_9fa48("328"), 'days'),
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("329") ? () => undefined : (stryCov_9fa48("329"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("330") ? `` : (stryCov_9fa48("330"), `${value}`))
    }), stryMutAct_9fa48("331") ? {} : (stryCov_9fa48("331"), {
      Header: stryMutAct_9fa48("332") ? "" : (stryCov_9fa48("332"), 'Time'),
      accessor: stryMutAct_9fa48("333") ? () => undefined : (stryCov_9fa48("333"), row => formatTime(row.section.timeLocations)),
      disableGroupBy: true,
      id: stryMutAct_9fa48("335") ? "" : (stryCov_9fa48("335"), 'time'),
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("336") ? () => undefined : (stryCov_9fa48("336"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("337") ? `` : (stryCov_9fa48("337"), `${value}`))
    }), stryMutAct_9fa48("338") ? {} : (stryCov_9fa48("338"), {
      Header: stryMutAct_9fa48("339") ? "" : (stryCov_9fa48("339"), 'Instructor'),
      accessor: stryMutAct_9fa48("340") ? () => undefined : (stryCov_9fa48("340"), row => formatInstructors(row.section.instructors)),
      disableGroupBy: true,
      id: stryMutAct_9fa48("342") ? "" : (stryCov_9fa48("342"), 'instructor'),
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("343") ? () => undefined : (stryCov_9fa48("343"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("344") ? `` : (stryCov_9fa48("344"), `${value}`))
    }), stryMutAct_9fa48("345") ? {} : (stryCov_9fa48("345"), {
      Header: stryMutAct_9fa48("346") ? "" : (stryCov_9fa48("346"), 'Enroll Code'),
      accessor: stryMutAct_9fa48("347") ? "" : (stryCov_9fa48("347"), 'section.enrollCode'),
      disableGroupBy: true,
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("349") ? () => undefined : (stryCov_9fa48("349"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("350") ? `` : (stryCov_9fa48("350"), `${value}`))
    })]);
    const testid = stryMutAct_9fa48("351") ? "" : (stryCov_9fa48("351"), "SectionsTable");
    const columnsToDisplay = columns;
    return <SectionsTableBase data={sections} columns={columnsToDisplay} testid={testid} />;
  }
}
;