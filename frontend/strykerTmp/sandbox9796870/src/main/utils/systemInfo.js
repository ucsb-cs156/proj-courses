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

import { useQuery } from "react-query";
import axios from "axios";
export function useSystemInfo() {
  if (stryMutAct_9fa48("825")) {
    {}
  } else {
    stryCov_9fa48("825");
    return useQuery(stryMutAct_9fa48("826") ? "" : (stryCov_9fa48("826"), "systemInfo"), async () => {
      if (stryMutAct_9fa48("827")) {
        {}
      } else {
        stryCov_9fa48("827");

        try {
          if (stryMutAct_9fa48("828")) {
            {}
          } else {
            stryCov_9fa48("828");
            const response = await axios.get(stryMutAct_9fa48("829") ? "" : (stryCov_9fa48("829"), "/api/systemInfo"));
            return response.data;
          }
        } catch (e) {
          if (stryMutAct_9fa48("830")) {
            {}
          } else {
            stryCov_9fa48("830");
            console.error(stryMutAct_9fa48("831") ? "" : (stryCov_9fa48("831"), "Error invoking axios.get: "), e);
            return stryMutAct_9fa48("832") ? {} : (stryCov_9fa48("832"), {
              springH2ConsoleEnabled: stryMutAct_9fa48("833") ? true : (stryCov_9fa48("833"), false),
              showSwaggerUILink: stryMutAct_9fa48("834") ? true : (stryCov_9fa48("834"), false),
              startQtrYYYYQ: stryMutAct_9fa48("835") ? "" : (stryCov_9fa48("835"), "20221"),
              endQtrYYYYQ: stryMutAct_9fa48("836") ? "" : (stryCov_9fa48("836"), "20222")
            });
          }
        }
      }
    }, stryMutAct_9fa48("837") ? {} : (stryCov_9fa48("837"), {
      initialData: stryMutAct_9fa48("838") ? {} : (stryCov_9fa48("838"), {
        initialData: stryMutAct_9fa48("839") ? false : (stryCov_9fa48("839"), true),
        springH2ConsoleEnabled: stryMutAct_9fa48("840") ? true : (stryCov_9fa48("840"), false),
        showSwaggerUILink: stryMutAct_9fa48("841") ? true : (stryCov_9fa48("841"), false),
        startQtrYYYYQ: stryMutAct_9fa48("842") ? "" : (stryCov_9fa48("842"), "20221"),
        endQtrYYYYQ: stryMutAct_9fa48("843") ? "" : (stryCov_9fa48("843"), "20222")
      })
    }));
  }
}