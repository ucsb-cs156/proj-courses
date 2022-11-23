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

import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-toastify"; // example
//  queryKey ["/api/users/all"] for "api/users/all"
//  queryKey ["/api/users","4"]  for "/api/users?id=4"
// For axiosParameters
//   
// {
//     method: 'post',
//     url: '/user/12345',
//     data: {
//       firstName: 'Fred',
//       lastName: 'Flintstone'
//     }
//  }
// 
// GET Example:
// useBackend(
//     ["/api/admin/users"],
//     { method: "GET", url: "/api/admin/users" },
//     []
// );

export function useBackend(queryKey, axiosParameters, initialData) {
  if (stryMutAct_9fa48("918")) {
    {}
  } else {
    stryCov_9fa48("918");
    return useQuery(queryKey, async () => {
      if (stryMutAct_9fa48("919")) {
        {}
      } else {
        stryCov_9fa48("919");

        try {
          if (stryMutAct_9fa48("920")) {
            {}
          } else {
            stryCov_9fa48("920");
            const response = await axios(axiosParameters);
            return response.data;
          }
        } catch (e) {
          if (stryMutAct_9fa48("921")) {
            {}
          } else {
            stryCov_9fa48("921");
            const errorMessage = stryMutAct_9fa48("922") ? `` : (stryCov_9fa48("922"), `Error communicating with backend via ${axiosParameters.method} on ${axiosParameters.url}`);
            toast(errorMessage);
            console.error(errorMessage, e);
            throw e;
          }
        }
      }
    }, stryMutAct_9fa48("923") ? {} : (stryCov_9fa48("923"), {
      initialData
    }));
  }
} // const wrappedParams = async (params) =>
//   await ( await axios(params)).data;

const reportAxiosError = error => {
  if (stryMutAct_9fa48("924")) {
    {}
  } else {
    stryCov_9fa48("924");
    console.error(stryMutAct_9fa48("925") ? "" : (stryCov_9fa48("925"), "Axios Error:"), error);
    toast(stryMutAct_9fa48("926") ? `` : (stryCov_9fa48("926"), `Axios Error: ${error}`));
    return null;
  }
};

const wrappedParams = async params => {
  if (stryMutAct_9fa48("927")) {
    {}
  } else {
    stryCov_9fa48("927");

    try {
      if (stryMutAct_9fa48("928")) {
        {}
      } else {
        stryCov_9fa48("928");
        return await (await axios(params)).data;
      }
    } catch (rejectedValue) {
      if (stryMutAct_9fa48("929")) {
        {}
      } else {
        stryCov_9fa48("929");
        reportAxiosError(rejectedValue);
        throw rejectedValue;
      }
    }
  }
};

export function useBackendMutation(objectToAxiosParams, useMutationParams, queryKey = null) {
  if (stryMutAct_9fa48("930")) {
    {}
  } else {
    stryCov_9fa48("930");
    const queryClient = useQueryClient();
    return useMutation(stryMutAct_9fa48("931") ? () => undefined : (stryCov_9fa48("931"), object => wrappedParams(objectToAxiosParams(object))), stryMutAct_9fa48("932") ? {} : (stryCov_9fa48("932"), {
      onError: data => {
        if (stryMutAct_9fa48("933")) {
          {}
        } else {
          stryCov_9fa48("933");
          toast(stryMutAct_9fa48("934") ? `` : (stryCov_9fa48("934"), `${data}`));
        }
      },
      // Stryker disable all: Not sure how to set up the complex behavior needed to test this
      onSettled: () => {
        if (queryKey !== null) queryClient.invalidateQueries(queryKey);
      },
      // Stryker enable all
      retry: false,
      ...useMutationParams
    }));
  }
}