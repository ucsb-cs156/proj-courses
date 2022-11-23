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

import React from 'react';
import { Badge } from "react-bootstrap";
export default function RoleBadge({
  role,
  currentUser
}) {
  if (stryMutAct_9fa48("248")) {
    {}
  } else {
    stryCov_9fa48("248");
    const roles = currentUser.root.roles.map(stryMutAct_9fa48("249") ? () => undefined : (stryCov_9fa48("249"), o => o.authority));
    const lcrole = role.replace(stryMutAct_9fa48("250") ? "" : (stryCov_9fa48("250"), "ROLE_"), stryMutAct_9fa48("251") ? "Stryker was here!" : (stryCov_9fa48("251"), "")).toLowerCase();
    return roles.includes(role) ? <Badge className="bg-primary" data-testid={stryMutAct_9fa48("252") ? `` : (stryCov_9fa48("252"), `role-badge-${lcrole}`)}>{lcrole}</Badge> : <span data-testid={stryMutAct_9fa48("253") ? `` : (stryCov_9fa48("253"), `role-missing-${lcrole}`)}></span>;
  }
}