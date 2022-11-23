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
import BasicCourseTable from "main/components/Courses/BasicCourseTable";
import { useBackendMutation } from "main/utils/useBackend";
export default function CourseDescriptionIndexPage() {
  if (stryMutAct_9fa48("463")) {
    {}
  } else {
    stryCov_9fa48("463");
    // Stryker disable next-line all : Can't test state because hook is internal
    const [courseJSON, setCourseJSON] = useState([]);
    const objectToAxiosParams = stryMutAct_9fa48("465") ? () => undefined : (stryCov_9fa48("465"), (() => {
      const objectToAxiosParams = query => stryMutAct_9fa48("466") ? {} : (stryCov_9fa48("466"), {
        url: stryMutAct_9fa48("467") ? "" : (stryCov_9fa48("467"), "/api/public/basicsearch"),
        params: stryMutAct_9fa48("468") ? {} : (stryCov_9fa48("468"), {
          qtr: query.quarter,
          dept: query.subject,
          level: query.level
        })
      });

      return objectToAxiosParams;
    })());

    const onSuccess = courses => {
      if (stryMutAct_9fa48("469")) {
        {}
      } else {
        stryCov_9fa48("469");
        setCourseJSON(courses.classes);
      }
    };

    const mutation = useBackendMutation(objectToAxiosParams, stryMutAct_9fa48("470") ? {} : (stryCov_9fa48("470"), {
      onSuccess
    }), // Stryker disable next-line all : hard to set up test for caching
    []);

    async function fetchBasicCourseJSON(_event, query) {
      if (stryMutAct_9fa48("472")) {
        {}
      } else {
        stryCov_9fa48("472");
        mutation.mutate(query);
      }
    }

    return <BasicLayout>
      <div className="pt-2">
        <h5>Welcome to the UCSB Courses Description Search!</h5>
        <BasicCourseSearchForm fetchJSON={fetchBasicCourseJSON} />
        <BasicCourseTable courses={courseJSON} />
      </div>
    </BasicLayout>;
  }
}