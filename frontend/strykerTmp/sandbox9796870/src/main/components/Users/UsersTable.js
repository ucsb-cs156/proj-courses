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
const columns = stryMutAct_9fa48("417") ? [] : (stryCov_9fa48("417"), [stryMutAct_9fa48("418") ? {} : (stryCov_9fa48("418"), {
  Header: stryMutAct_9fa48("419") ? "" : (stryCov_9fa48("419"), 'id'),
  accessor: stryMutAct_9fa48("420") ? "" : (stryCov_9fa48("420"), 'id') // accessor is the "key" in the data

}), stryMutAct_9fa48("421") ? {} : (stryCov_9fa48("421"), {
  Header: stryMutAct_9fa48("422") ? "" : (stryCov_9fa48("422"), 'First Name'),
  accessor: stryMutAct_9fa48("423") ? "" : (stryCov_9fa48("423"), 'givenName')
}), stryMutAct_9fa48("424") ? {} : (stryCov_9fa48("424"), {
  Header: stryMutAct_9fa48("425") ? "" : (stryCov_9fa48("425"), 'Last Name'),
  accessor: stryMutAct_9fa48("426") ? "" : (stryCov_9fa48("426"), 'familyName')
}), stryMutAct_9fa48("427") ? {} : (stryCov_9fa48("427"), {
  Header: stryMutAct_9fa48("428") ? "" : (stryCov_9fa48("428"), 'Email'),
  accessor: stryMutAct_9fa48("429") ? "" : (stryCov_9fa48("429"), 'email')
}), stryMutAct_9fa48("430") ? {} : (stryCov_9fa48("430"), {
  Header: stryMutAct_9fa48("431") ? "" : (stryCov_9fa48("431"), 'Admin'),
  id: stryMutAct_9fa48("432") ? "" : (stryCov_9fa48("432"), 'admin'),
  accessor: stryMutAct_9fa48("433") ? () => undefined : (stryCov_9fa48("433"), (row, _rowIndex) => String(row.admin)) // hack needed for boolean values to show up

})]);
export default function UsersTable({
  users
}) {
  if (stryMutAct_9fa48("434")) {
    {}
  } else {
    stryCov_9fa48("434");
    return <OurTable data={users} columns={columns} testid={stryMutAct_9fa48("435") ? "" : (stryCov_9fa48("435"), "UsersTable")} />;
  }
}
;