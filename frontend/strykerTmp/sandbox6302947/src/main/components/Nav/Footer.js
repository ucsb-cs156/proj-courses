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

import { Container } from "react-bootstrap";
export const space = stryMutAct_9fa48("165") ? "" : (stryCov_9fa48("165"), " ");
export default function Footer() {
  if (stryMutAct_9fa48("166")) {
    {}
  } else {
    stryCov_9fa48("166");
    return <footer className="bg-light pt-3 pt-md-4 pb-4 pb-md-5">
      <Container>
      <p>
      This app is a class project of{space}
      <a data-testid="footer-class-website-link" href="https://ucsb-cs156.github.io" target="_blank" rel="noopener noreferrer">
        CMPSC 156
      </a>
      {space}
      at
      {space}
      <a data-testid="footer-ucsb-link" href="https://ucsb.edu" target="_blank" rel="noopener noreferrer">
        UCSB
      </a>
      . Check out the source code on
      {space}
      <a data-testid="footer-source-code-link" href="https://github.com/ucsb-cs156-s22/s22-4pm-courses" target="_blank" rel="noopener noreferrer">
      GitHub
      </a>
      !
      This is not an official source of UCSB course information. An official
      source can be found
      {space}
      <a data-testid="footer-course-search-link" href="https://my.sa.ucsb.edu/public/curriculum/coursesearch.aspx" target="_blank" rel="noopener noreferrer">
        here
      </a>
      .
      </p>
      <p>
        The cartoon Storke Tower images in the brand logo and favicon for this site were
        developed by Chelsea Lyon-Hayden, Art Director for UCSB Associate Students, and are
        used here by permission of the Executive Director of UCSB Associated Students.
        These images are Copyright © 2021 UCSB Associated Students, and may not be reused
        without express written permission of the Executive Director of UCSB Associated Students.  For more info, visit: 
        {space}
        <a data-testid="footer-sticker-link" href="https://www.as.ucsb.edu/sticker-packs">www.as.ucsb.edu/sticker-packs/</a>
      </p>
      </Container>
    </footer>;
  }
}