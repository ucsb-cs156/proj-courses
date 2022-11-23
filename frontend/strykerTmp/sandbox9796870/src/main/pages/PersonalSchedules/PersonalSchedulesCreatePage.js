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
import PersonalScheduleForm from "main/components/PersonalSchedules/PersonalScheduleForm";
import { Navigate } from 'react-router-dom';
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
export default function PersonalSchedulesCreatePage() {
  if (stryMutAct_9fa48("495")) {
    {}
  } else {
    stryCov_9fa48("495");
    const objectToAxiosParams = stryMutAct_9fa48("496") ? () => undefined : (stryCov_9fa48("496"), (() => {
      const objectToAxiosParams = personalSchedule => stryMutAct_9fa48("497") ? {} : (stryCov_9fa48("497"), {
        url: stryMutAct_9fa48("498") ? "" : (stryCov_9fa48("498"), "/api/personalschedules/post"),
        method: stryMutAct_9fa48("499") ? "" : (stryCov_9fa48("499"), "POST"),
        params: stryMutAct_9fa48("500") ? {} : (stryCov_9fa48("500"), {
          name: personalSchedule.name,
          description: personalSchedule.description,
          quarter: personalSchedule.quarter
        })
      });

      return objectToAxiosParams;
    })());

    const onSuccess = personalSchedule => {
      if (stryMutAct_9fa48("501")) {
        {}
      } else {
        stryCov_9fa48("501");
        toast(stryMutAct_9fa48("502") ? `` : (stryCov_9fa48("502"), `New personalSchedule Created - id: ${personalSchedule.id} name: ${personalSchedule.name}`));
      }
    };

    const mutation = useBackendMutation(objectToAxiosParams, stryMutAct_9fa48("503") ? {} : (stryCov_9fa48("503"), {
      onSuccess
    }), // Stryker disable next-line all : hard to set up test for caching
    ["/api/personalschedules/all"]);
    const {
      isSuccess
    } = mutation;

    const onSubmit = async data => {
      if (stryMutAct_9fa48("506")) {
        {}
      } else {
        stryCov_9fa48("506");
        const quarter = stryMutAct_9fa48("507") ? {} : (stryCov_9fa48("507"), {
          quarter: localStorage[stryMutAct_9fa48("508") ? "" : (stryCov_9fa48("508"), "PersonalScheduleForm-quarter")]
        });
        console.log(quarter);
        const dataFinal = Object.assign(data, quarter);
        console.log(dataFinal);
        mutation.mutate(dataFinal);
      }
    };

    if (stryMutAct_9fa48("510") ? false : stryMutAct_9fa48("509") ? true : (stryCov_9fa48("509", "510"), isSuccess)) {
      if (stryMutAct_9fa48("511")) {
        {}
      } else {
        stryCov_9fa48("511");
        return <Navigate to="/personalschedules/list" />;
      }
    }

    return <BasicLayout>
      <div className="pt-2">
        <h1>Create New PersonalSchedule</h1>

        <PersonalScheduleForm submitAction={onSubmit} />

      </div>
    </BasicLayout>;
  }
}