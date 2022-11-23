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
  if (stryMutAct_9fa48("514")) {
    {}
  } else {
    stryCov_9fa48("514");
    const objectToAxiosParams = stryMutAct_9fa48("515") ? () => undefined : (stryCov_9fa48("515"), (() => {
      const objectToAxiosParams = personalSchedule => stryMutAct_9fa48("516") ? {} : (stryCov_9fa48("516"), {
        url: stryMutAct_9fa48("517") ? "" : (stryCov_9fa48("517"), "/api/personalschedules/post"),
        method: stryMutAct_9fa48("518") ? "" : (stryCov_9fa48("518"), "POST"),
        params: stryMutAct_9fa48("519") ? {} : (stryCov_9fa48("519"), {
          name: personalSchedule.name,
          description: personalSchedule.description,
          quarter: personalSchedule.quarter
        })
      });

      return objectToAxiosParams;
    })());

    const onSuccess = personalSchedule => {
      if (stryMutAct_9fa48("520")) {
        {}
      } else {
        stryCov_9fa48("520");
        toast(stryMutAct_9fa48("521") ? `` : (stryCov_9fa48("521"), `New personalSchedule Created - id: ${personalSchedule.id} name: ${personalSchedule.name}`));
      }
    };

    const mutation = useBackendMutation(objectToAxiosParams, stryMutAct_9fa48("522") ? {} : (stryCov_9fa48("522"), {
      onSuccess
    }), // Stryker disable next-line all : hard to set up test for caching
    ["/api/personalschedules/all"]);
    const {
      isSuccess
    } = mutation;

    const onSubmit = async data => {
      if (stryMutAct_9fa48("525")) {
        {}
      } else {
        stryCov_9fa48("525");
        const quarter = stryMutAct_9fa48("526") ? {} : (stryCov_9fa48("526"), {
          quarter: localStorage[stryMutAct_9fa48("527") ? "" : (stryCov_9fa48("527"), "PersonalScheduleForm-quarter")]
        });
        console.log(quarter);
        const dataFinal = Object.assign(data, quarter);
        console.log(dataFinal);
        mutation.mutate(dataFinal);
      }
    };

    if (stryMutAct_9fa48("529") ? false : stryMutAct_9fa48("528") ? true : (stryCov_9fa48("528", "529"), isSuccess)) {
      if (stryMutAct_9fa48("530")) {
        {}
      } else {
        stryCov_9fa48("530");
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