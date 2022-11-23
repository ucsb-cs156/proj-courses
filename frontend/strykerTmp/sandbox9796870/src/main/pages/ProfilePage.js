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
import { Row, Col } from "react-bootstrap";
import RoleBadge from "main/components/Profile/RoleBadge";
import { useCurrentUser } from "main/utils/currentUser";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ReactJson from "react-json-view";

const ProfilePage = () => {
  if (stryMutAct_9fa48("532")) {
    {}
  } else {
    stryCov_9fa48("532");
    const {
      data: currentUser
    } = useCurrentUser();

    if (stryMutAct_9fa48("535") ? false : stryMutAct_9fa48("534") ? true : stryMutAct_9fa48("533") ? currentUser.loggedIn : (stryCov_9fa48("533", "534", "535"), !currentUser.loggedIn)) {
      if (stryMutAct_9fa48("536")) {
        {}
      } else {
        stryCov_9fa48("536");
        return <p>Not logged in.</p>;
      }
    }

    const {
      email,
      pictureUrl,
      fullName
    } = currentUser.root.user;
    return <BasicLayout>
            <Row className="align-items-center profile-header mb-5 text-center text-md-left">
                <Col md={2}>
                    <img src={pictureUrl} alt="Profile" className="rounded-circle img-fluid profile-picture mb-3 mb-md-0" />
                </Col>
                <Col md>
                    <h2>{fullName}</h2>
                    <p className="lead text-muted">{email}</p>
                    <RoleBadge role={stryMutAct_9fa48("537") ? "" : (stryCov_9fa48("537"), "ROLE_USER")} currentUser={currentUser} />
                    <RoleBadge role={stryMutAct_9fa48("538") ? "" : (stryCov_9fa48("538"), "ROLE_MEMBER")} currentUser={currentUser} />
                    <RoleBadge role={stryMutAct_9fa48("539") ? "" : (stryCov_9fa48("539"), "ROLE_ADMIN")} currentUser={currentUser} />
                </Col>
            </Row>
            <Row className="text-left">
                <ReactJson src={currentUser.root} />
            </Row>
        </BasicLayout>;
  }
};

export default ProfilePage;