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
import { useBackendMutation, useBackend } from "main/utils/useBackend";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import UCSBSubjectsTable from 'main/components/UCSBSubjects/UCSBSubjectsTable';
export default function AdminLoadSubjectsPage() {
  if (stryMutAct_9fa48("456")) {
    {}
  } else {
    stryCov_9fa48("456");
    const {
      data: subjects,
      error: _error,
      status: _status
    } = useBackend( // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/UCSBSubjects/all"], {
      method: "GET",
      url: "/api/UCSBSubjects/all"
    }, []);
    const objectToAxiosParams = stryMutAct_9fa48("463") ? () => undefined : (stryCov_9fa48("463"), (() => {
      const objectToAxiosParams = () => stryMutAct_9fa48("464") ? {} : (stryCov_9fa48("464"), {
        url: stryMutAct_9fa48("465") ? "" : (stryCov_9fa48("465"), '/api/UCSBSubjects/load'),
        method: stryMutAct_9fa48("466") ? "" : (stryCov_9fa48("466"), 'POST')
      });

      return objectToAxiosParams;
    })());
    var subjectsCount = subjects.length;

    const onSuccess = subjects => {
      if (stryMutAct_9fa48("467")) {
        {}
      } else {
        stryCov_9fa48("467");
        toast(stryMutAct_9fa48("468") ? `` : (stryCov_9fa48("468"), `Number of Subjects Loaded : ${stryMutAct_9fa48("469") ? subjects.length + subjectsCount : (stryCov_9fa48("469"), subjects.length - subjectsCount)}`));
        subjectsCount = subjects.length;
      }
    };

    const mutation = useBackendMutation(objectToAxiosParams, stryMutAct_9fa48("470") ? {} : (stryCov_9fa48("470"), {
      onSuccess
    }), // Stryker disable next-line all : hard to set up test for caching
    ["/api/UCSBSubjects/all"]);

    const onSubmit = async data => {
      if (stryMutAct_9fa48("473")) {
        {}
      } else {
        stryCov_9fa48("473");
        mutation.mutate(data);
      }
    };

    return <BasicLayout>
      <h2>Subjects</h2>
      <Button variant="primary" onClick={onSubmit} data-testid="AdminLoadSubjects-Load-Button">
        Load Subjects
      </Button>
      <UCSBSubjectsTable subjects={subjects} />
    </BasicLayout>;
  }
}
;