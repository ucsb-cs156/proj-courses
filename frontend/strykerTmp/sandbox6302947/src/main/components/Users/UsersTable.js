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
const columns = stryMutAct_9fa48("436") ? [] : (stryCov_9fa48("436"), [stryMutAct_9fa48("437") ? {} : (stryCov_9fa48("437"), {
  Header: stryMutAct_9fa48("438") ? "" : (stryCov_9fa48("438"), 'id'),
  accessor: stryMutAct_9fa48("439") ? "" : (stryCov_9fa48("439"), 'id') // accessor is the "key" in the data

}), stryMutAct_9fa48("440") ? {} : (stryCov_9fa48("440"), {
  Header: stryMutAct_9fa48("441") ? "" : (stryCov_9fa48("441"), 'First Name'),
  accessor: stryMutAct_9fa48("442") ? "" : (stryCov_9fa48("442"), 'givenName')
}), stryMutAct_9fa48("443") ? {} : (stryCov_9fa48("443"), {
  Header: stryMutAct_9fa48("444") ? "" : (stryCov_9fa48("444"), 'Last Name'),
  accessor: stryMutAct_9fa48("445") ? "" : (stryCov_9fa48("445"), 'familyName')
}), stryMutAct_9fa48("446") ? {} : (stryCov_9fa48("446"), {
  Header: stryMutAct_9fa48("447") ? "" : (stryCov_9fa48("447"), 'Email'),
  accessor: stryMutAct_9fa48("448") ? "" : (stryCov_9fa48("448"), 'email')
}), stryMutAct_9fa48("449") ? {} : (stryCov_9fa48("449"), {
  Header: stryMutAct_9fa48("450") ? "" : (stryCov_9fa48("450"), 'Admin'),
  id: stryMutAct_9fa48("451") ? "" : (stryCov_9fa48("451"), 'admin'),
  accessor: stryMutAct_9fa48("452") ? () => undefined : (stryCov_9fa48("452"), (row, _rowIndex) => String(row.admin)) // hack needed for boolean values to show up

})]);
export default function UsersTable({
  users
}) {
  if (stryMutAct_9fa48("453")) {
    {}
  } else {
    stryCov_9fa48("453");
    return <OurTable data={users} columns={columns} testid={stryMutAct_9fa48("454") ? "" : (stryCov_9fa48("454"), "UsersTable")} />;
  }
}
;