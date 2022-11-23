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
  if (stryMutAct_9fa48("301")) {
    {}
  } else {
    stryCov_9fa48("301");
    return values[0];
  }
}

;
export default function SectionsTable({
  sections
}) {
  if (stryMutAct_9fa48("302")) {
    {}
  } else {
    stryCov_9fa48("302");
    // Stryker enable all 
    // Stryker disable BooleanLiteral
    const columns = stryMutAct_9fa48("303") ? [] : (stryCov_9fa48("303"), [stryMutAct_9fa48("304") ? {} : (stryCov_9fa48("304"), {
      Header: stryMutAct_9fa48("305") ? "" : (stryCov_9fa48("305"), 'Quarter'),
      accessor: stryMutAct_9fa48("306") ? () => undefined : (stryCov_9fa48("306"), row => yyyyqToQyy(row.courseInfo.quarter)),
      disableGroupBy: true,
      id: stryMutAct_9fa48("308") ? "" : (stryCov_9fa48("308"), 'quarter'),
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("309") ? () => undefined : (stryCov_9fa48("309"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("310") ? `` : (stryCov_9fa48("310"), `${value}`))
    }), stryMutAct_9fa48("311") ? {} : (stryCov_9fa48("311"), {
      Header: stryMutAct_9fa48("312") ? "" : (stryCov_9fa48("312"), 'Course ID'),
      accessor: stryMutAct_9fa48("313") ? "" : (stryCov_9fa48("313"), 'courseInfo.courseId'),
      Cell: stryMutAct_9fa48("314") ? () => undefined : (stryCov_9fa48("314"), ({
        cell: {
          value
        }
      }) => value.substring(0, stryMutAct_9fa48("315") ? value.length + 2 : (stryCov_9fa48("315"), value.length - 2)))
    }), stryMutAct_9fa48("316") ? {} : (stryCov_9fa48("316"), {
      Header: stryMutAct_9fa48("317") ? "" : (stryCov_9fa48("317"), 'Title'),
      accessor: stryMutAct_9fa48("318") ? "" : (stryCov_9fa48("318"), 'courseInfo.title'),
      disableGroupBy: true,
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("320") ? () => undefined : (stryCov_9fa48("320"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("321") ? `` : (stryCov_9fa48("321"), `${value}`))
    }), stryMutAct_9fa48("322") ? {} : (stryCov_9fa48("322"), {
      // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
      Header: 'Is Section?',
      accessor: stryMutAct_9fa48("324") ? () => undefined : (stryCov_9fa48("324"), row => isSection(row.section.section)),
      // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
      id: 'isSection'
    }), stryMutAct_9fa48("326") ? {} : (stryCov_9fa48("326"), {
      Header: stryMutAct_9fa48("327") ? "" : (stryCov_9fa48("327"), 'Enrolled'),
      accessor: stryMutAct_9fa48("328") ? () => undefined : (stryCov_9fa48("328"), row => convertToFraction(row.section.enrolledTotal, row.section.maxEnroll)),
      disableGroupBy: true,
      id: stryMutAct_9fa48("330") ? "" : (stryCov_9fa48("330"), 'enrolled'),
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("331") ? () => undefined : (stryCov_9fa48("331"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("332") ? `` : (stryCov_9fa48("332"), `${value}`))
    }), stryMutAct_9fa48("333") ? {} : (stryCov_9fa48("333"), {
      Header: stryMutAct_9fa48("334") ? "" : (stryCov_9fa48("334"), 'Location'),
      accessor: stryMutAct_9fa48("335") ? () => undefined : (stryCov_9fa48("335"), row => formatLocation(row.section.timeLocations)),
      disableGroupBy: true,
      id: stryMutAct_9fa48("337") ? "" : (stryCov_9fa48("337"), 'location'),
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("338") ? () => undefined : (stryCov_9fa48("338"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("339") ? `` : (stryCov_9fa48("339"), `${value}`))
    }), stryMutAct_9fa48("340") ? {} : (stryCov_9fa48("340"), {
      Header: stryMutAct_9fa48("341") ? "" : (stryCov_9fa48("341"), 'Days'),
      accessor: stryMutAct_9fa48("342") ? () => undefined : (stryCov_9fa48("342"), row => formatDays(row.section.timeLocations)),
      disableGroupBy: true,
      id: stryMutAct_9fa48("344") ? "" : (stryCov_9fa48("344"), 'days'),
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("345") ? () => undefined : (stryCov_9fa48("345"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("346") ? `` : (stryCov_9fa48("346"), `${value}`))
    }), stryMutAct_9fa48("347") ? {} : (stryCov_9fa48("347"), {
      Header: stryMutAct_9fa48("348") ? "" : (stryCov_9fa48("348"), 'Time'),
      accessor: stryMutAct_9fa48("349") ? () => undefined : (stryCov_9fa48("349"), row => formatTime(row.section.timeLocations)),
      disableGroupBy: true,
      id: stryMutAct_9fa48("351") ? "" : (stryCov_9fa48("351"), 'time'),
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("352") ? () => undefined : (stryCov_9fa48("352"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("353") ? `` : (stryCov_9fa48("353"), `${value}`))
    }), stryMutAct_9fa48("354") ? {} : (stryCov_9fa48("354"), {
      Header: stryMutAct_9fa48("355") ? "" : (stryCov_9fa48("355"), 'Instructor'),
      accessor: stryMutAct_9fa48("356") ? () => undefined : (stryCov_9fa48("356"), row => formatInstructors(row.section.instructors)),
      disableGroupBy: true,
      id: stryMutAct_9fa48("358") ? "" : (stryCov_9fa48("358"), 'instructor'),
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("359") ? () => undefined : (stryCov_9fa48("359"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("360") ? `` : (stryCov_9fa48("360"), `${value}`))
    }), stryMutAct_9fa48("361") ? {} : (stryCov_9fa48("361"), {
      Header: stryMutAct_9fa48("362") ? "" : (stryCov_9fa48("362"), 'Enroll Code'),
      accessor: stryMutAct_9fa48("363") ? "" : (stryCov_9fa48("363"), 'section.enrollCode'),
      disableGroupBy: true,
      aggregate: getFirstVal,
      Aggregated: stryMutAct_9fa48("365") ? () => undefined : (stryCov_9fa48("365"), ({
        cell: {
          value
        }
      }) => stryMutAct_9fa48("366") ? `` : (stryCov_9fa48("366"), `${value}`))
    })]);
    const testid = stryMutAct_9fa48("367") ? "" : (stryCov_9fa48("367"), "SectionsTable");
    const columnsToDisplay = columns;
    return <SectionsTableBase data={sections} columns={columnsToDisplay} testid={testid} />;
  }
}
;