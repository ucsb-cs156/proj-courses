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
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BasicCourseSearchForm from "main/components/BasicCourseSearch/BasicCourseSearchForm";
import _BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { useBackendMutation } from "main/utils/useBackend";
import SectionsTable from "main/components/Sections/SectionsTable";
export default function SectionSearchesIndexPage() {
  if (stryMutAct_9fa48("559")) {
    {}
  } else {
    stryCov_9fa48("559");
    // Stryker disable next-line all : Can't test state because hook is internal
    const [sectionJSON, setSectionJSON] = useState([]);
    const objectToAxiosParams = stryMutAct_9fa48("561") ? () => undefined : (stryCov_9fa48("561"), (() => {
      const objectToAxiosParams = query => stryMutAct_9fa48("562") ? {} : (stryCov_9fa48("562"), {
        url: stryMutAct_9fa48("563") ? "" : (stryCov_9fa48("563"), "/api/sections/basicsearch"),
        params: stryMutAct_9fa48("564") ? {} : (stryCov_9fa48("564"), {
          qtr: query.quarter,
          dept: query.subject,
          level: query.level
        })
      });

      return objectToAxiosParams;
    })());

    const onSuccess = section => {
      if (stryMutAct_9fa48("565")) {
        {}
      } else {
        stryCov_9fa48("565");
        console.log();
        setSectionJSON(section);
      }
    };

    const mutation = useBackendMutation(objectToAxiosParams, stryMutAct_9fa48("566") ? {} : (stryCov_9fa48("566"), {
      onSuccess
    }), // Stryker disable next-line all : hard to set up test for caching
    []);

    async function fetchBasicSectionJSON(_event, query) {
      if (stryMutAct_9fa48("568")) {
        {}
      } else {
        stryCov_9fa48("568");
        mutation.mutate(query);
      }
    }

    return <BasicLayout>
      <div className="pt-2">
        <h5>Welcome to the UCSB Section Search App!</h5>
        <BasicCourseSearchForm fetchJSON={fetchBasicSectionJSON} />
        <SectionsTable sections={sectionJSON} />
      </div>
    </BasicLayout>;
  }
}