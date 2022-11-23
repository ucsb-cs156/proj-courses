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
  if (stryMutAct_9fa48("844")) {
    {}
  } else {
    stryCov_9fa48("844");
    return useQuery(stryMutAct_9fa48("845") ? "" : (stryCov_9fa48("845"), "systemInfo"), async () => {
      if (stryMutAct_9fa48("846")) {
        {}
      } else {
        stryCov_9fa48("846");

        try {
          if (stryMutAct_9fa48("847")) {
            {}
          } else {
            stryCov_9fa48("847");
            const response = await axios.get(stryMutAct_9fa48("848") ? "" : (stryCov_9fa48("848"), "/api/systemInfo"));
            return response.data;
          }
        } catch (e) {
          if (stryMutAct_9fa48("849")) {
            {}
          } else {
            stryCov_9fa48("849");
            console.error(stryMutAct_9fa48("850") ? "" : (stryCov_9fa48("850"), "Error invoking axios.get: "), e);
            return stryMutAct_9fa48("851") ? {} : (stryCov_9fa48("851"), {
              springH2ConsoleEnabled: stryMutAct_9fa48("852") ? true : (stryCov_9fa48("852"), false),
              showSwaggerUILink: stryMutAct_9fa48("853") ? true : (stryCov_9fa48("853"), false),
              startQtrYYYYQ: stryMutAct_9fa48("854") ? "" : (stryCov_9fa48("854"), "20221"),
              endQtrYYYYQ: stryMutAct_9fa48("855") ? "" : (stryCov_9fa48("855"), "20222")
            });
          }
        }
      }
    }, stryMutAct_9fa48("856") ? {} : (stryCov_9fa48("856"), {
      initialData: stryMutAct_9fa48("857") ? {} : (stryCov_9fa48("857"), {
        initialData: stryMutAct_9fa48("858") ? false : (stryCov_9fa48("858"), true),
        springH2ConsoleEnabled: stryMutAct_9fa48("859") ? true : (stryCov_9fa48("859"), false),
        showSwaggerUILink: stryMutAct_9fa48("860") ? true : (stryCov_9fa48("860"), false),
        startQtrYYYYQ: stryMutAct_9fa48("861") ? "" : (stryCov_9fa48("861"), "20221"),
        endQtrYYYYQ: stryMutAct_9fa48("862") ? "" : (stryCov_9fa48("862"), "20222")
      })
    }));
  }
}