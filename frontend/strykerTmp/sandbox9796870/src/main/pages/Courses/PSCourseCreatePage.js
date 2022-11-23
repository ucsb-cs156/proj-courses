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

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseForm from "main/components/Courses/CourseForm";
import { Navigate } from 'react-router-dom';
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
export default function CoursesCreatePage() {
  if (stryMutAct_9fa48("473")) {
    {}
  } else {
    stryCov_9fa48("473");
    const objectToAxiosParams = stryMutAct_9fa48("474") ? () => undefined : (stryCov_9fa48("474"), (() => {
      const objectToAxiosParams = course => stryMutAct_9fa48("475") ? {} : (stryCov_9fa48("475"), {
        url: stryMutAct_9fa48("476") ? "" : (stryCov_9fa48("476"), "/api/courses/post"),
        method: stryMutAct_9fa48("477") ? "" : (stryCov_9fa48("477"), "POST"),
        params: stryMutAct_9fa48("478") ? {} : (stryCov_9fa48("478"), {
          enrollCd: course.enrollCd,
          psId: course.psId
        })
      });

      return objectToAxiosParams;
    })());

    const onSuccess = course => {
      if (stryMutAct_9fa48("479")) {
        {}
      } else {
        stryCov_9fa48("479");
        toast(stryMutAct_9fa48("480") ? `` : (stryCov_9fa48("480"), `New course Created - id: ${course.id} enrollCd: ${course.enrollCd}`));
      }
    };

    const mutation = useBackendMutation(objectToAxiosParams, stryMutAct_9fa48("481") ? {} : (stryCov_9fa48("481"), {
      onSuccess
    }), // Stryker disable next-line all : hard to set up test for caching
    ["/api/courses/user/all"]);
    const {
      isSuccess
    } = mutation;

    const onSubmit = async data => {
      if (stryMutAct_9fa48("484")) {
        {}
      } else {
        stryCov_9fa48("484");
        mutation.mutate(data);
      }
    };

    if (stryMutAct_9fa48("486") ? false : stryMutAct_9fa48("485") ? true : (stryCov_9fa48("485", "486"), isSuccess)) {
      if (stryMutAct_9fa48("487")) {
        {}
      } else {
        stryCov_9fa48("487");
        return <Navigate to="/courses/list" />;
      }
    }

    return <BasicLayout>
      <div className="pt-2">
        <h1>Create New Course</h1>

        <CourseForm submitAction={onSubmit} />

      </div>
    </BasicLayout>;
  }
}