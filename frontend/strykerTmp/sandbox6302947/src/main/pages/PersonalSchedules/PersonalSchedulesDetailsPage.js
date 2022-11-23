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
import { useParams } from "react-router-dom";
import PersonalSchedulesTable from 'main/components/PersonalSchedules/PersonalSchedulesTable';
import { useBackend, _useBackendMutation } from "main/utils/useBackend";
export default function PersonalSchedulesDetailsPage() {
  if (stryMutAct_9fa48("531")) {
    {}
  } else {
    stryCov_9fa48("531");
    let {
      id
    } = useParams();
    const {
      data: personalSchedule,
      _error,
      _status
    } = useBackend( // Stryker disable all : hard to test for query caching
    [`/api/personalschedules?id=${id}`], {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/personalschedules?id=${id}`,
      params: {
        id
      }
    });
    return <BasicLayout>
      <div className="pt-2">
        <h1>PersonalSchedules Details</h1>
        {personalSchedule && <PersonalSchedulesTable personalSchedules={[personalSchedule]} showButtons={false} />}
            <p>
                This is where the list of courses will go 
            </p>
      </div>
    </BasicLayout>;
  }
}