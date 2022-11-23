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

import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export function useCurrentUser() {
  if (stryMutAct_9fa48("570")) {
    {}
  } else {
    stryCov_9fa48("570");
    let rolesList = stryMutAct_9fa48("571") ? [] : (stryCov_9fa48("571"), [stryMutAct_9fa48("572") ? "" : (stryCov_9fa48("572"), "ERROR_GETTING_ROLES")]);
    return useQuery(stryMutAct_9fa48("573") ? "" : (stryCov_9fa48("573"), "current user"), async () => {
      if (stryMutAct_9fa48("574")) {
        {}
      } else {
        stryCov_9fa48("574");

        try {
          if (stryMutAct_9fa48("575")) {
            {}
          } else {
            stryCov_9fa48("575");
            const response = await axios.get(stryMutAct_9fa48("576") ? "" : (stryCov_9fa48("576"), "/api/currentUser"));

            try {
              if (stryMutAct_9fa48("577")) {
                {}
              } else {
                stryCov_9fa48("577");
                rolesList = response.data.roles.map(stryMutAct_9fa48("578") ? () => undefined : (stryCov_9fa48("578"), r => r.authority));
              }
            } catch (e) {
              if (stryMutAct_9fa48("579")) {
                {}
              } else {
                stryCov_9fa48("579");
                console.error(stryMutAct_9fa48("580") ? "" : (stryCov_9fa48("580"), "Error getting roles: "), e);
              }
            }

            response.data = stryMutAct_9fa48("581") ? {} : (stryCov_9fa48("581"), { ...response.data,
              rolesList: rolesList
            });
            return stryMutAct_9fa48("582") ? {} : (stryCov_9fa48("582"), {
              loggedIn: stryMutAct_9fa48("583") ? false : (stryCov_9fa48("583"), true),
              root: response.data
            });
          }
        } catch (e) {
          if (stryMutAct_9fa48("584")) {
            {}
          } else {
            stryCov_9fa48("584");
            console.error(stryMutAct_9fa48("585") ? "" : (stryCov_9fa48("585"), "Error invoking axios.get: "), e);
            return stryMutAct_9fa48("586") ? {} : (stryCov_9fa48("586"), {
              loggedIn: stryMutAct_9fa48("587") ? true : (stryCov_9fa48("587"), false),
              root: null
            });
          }
        }
      }
    }, stryMutAct_9fa48("588") ? {} : (stryCov_9fa48("588"), {
      initialData: stryMutAct_9fa48("589") ? {} : (stryCov_9fa48("589"), {
        loggedIn: stryMutAct_9fa48("590") ? true : (stryCov_9fa48("590"), false),
        root: null,
        initialData: stryMutAct_9fa48("591") ? false : (stryCov_9fa48("591"), true)
      })
    }));
  }
}
export function useLogout() {
  if (stryMutAct_9fa48("592")) {
    {}
  } else {
    stryCov_9fa48("592");
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const mutation = useMutation(async () => {
      if (stryMutAct_9fa48("593")) {
        {}
      } else {
        stryCov_9fa48("593");
        await axios.post(stryMutAct_9fa48("594") ? "" : (stryCov_9fa48("594"), "/logout"));
        await queryClient.resetQueries(stryMutAct_9fa48("595") ? "" : (stryCov_9fa48("595"), "current user"), stryMutAct_9fa48("596") ? {} : (stryCov_9fa48("596"), {
          exact: stryMutAct_9fa48("597") ? false : (stryCov_9fa48("597"), true)
        }));
        navigate(stryMutAct_9fa48("598") ? "" : (stryCov_9fa48("598"), "/"));
      }
    });
    return mutation;
  }
}
export function hasRole(currentUser, role) {
  if (stryMutAct_9fa48("599")) {
    {}
  } else {
    stryCov_9fa48("599");
    // The following hack is because there is some bug in terms of the
    // shape of the data returned by useCurrentUser.  Is there a separate 
    // data level, or not? 
    // We will file an issue to track that down and then remove this hack
    if (stryMutAct_9fa48("602") ? currentUser != null : stryMutAct_9fa48("601") ? false : stryMutAct_9fa48("600") ? true : (stryCov_9fa48("600", "601", "602"), currentUser == null)) return stryMutAct_9fa48("603") ? true : (stryCov_9fa48("603"), false);

    if (stryMutAct_9fa48("606") ? "data" in currentUser && "root" in currentUser.data && currentUser.data.root != null || "rolesList" in currentUser.data.root : stryMutAct_9fa48("605") ? false : stryMutAct_9fa48("604") ? true : (stryCov_9fa48("604", "605", "606"), (stryMutAct_9fa48("608") ? "data" in currentUser && "root" in currentUser.data || currentUser.data.root != null : stryMutAct_9fa48("607") ? true : (stryCov_9fa48("607", "608"), (stryMutAct_9fa48("610") ? "data" in currentUser || "root" in currentUser.data : stryMutAct_9fa48("609") ? true : (stryCov_9fa48("609", "610"), (stryMutAct_9fa48("611") ? "" : (stryCov_9fa48("611"), "data")) in currentUser && (stryMutAct_9fa48("612") ? "" : (stryCov_9fa48("612"), "root")) in currentUser.data)) && (stryMutAct_9fa48("614") ? currentUser.data.root == null : stryMutAct_9fa48("613") ? true : (stryCov_9fa48("613", "614"), currentUser.data.root != null)))) && (stryMutAct_9fa48("615") ? "" : (stryCov_9fa48("615"), "rolesList")) in currentUser.data.root)) {
      if (stryMutAct_9fa48("616")) {
        {}
      } else {
        stryCov_9fa48("616");
        return currentUser.data.root.rolesList.includes(role);
      }
    }

    return stryMutAct_9fa48("618") ? currentUser.root.rolesList?.includes(role) : stryMutAct_9fa48("617") ? currentUser.root?.rolesList.includes(role) : (stryCov_9fa48("617", "618"), currentUser.root?.rolesList?.includes(role));
  }
}