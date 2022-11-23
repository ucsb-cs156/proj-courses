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
  if (stryMutAct_9fa48("589")) {
    {}
  } else {
    stryCov_9fa48("589");
    let rolesList = stryMutAct_9fa48("590") ? [] : (stryCov_9fa48("590"), [stryMutAct_9fa48("591") ? "" : (stryCov_9fa48("591"), "ERROR_GETTING_ROLES")]);
    return useQuery(stryMutAct_9fa48("592") ? "" : (stryCov_9fa48("592"), "current user"), async () => {
      if (stryMutAct_9fa48("593")) {
        {}
      } else {
        stryCov_9fa48("593");

        try {
          if (stryMutAct_9fa48("594")) {
            {}
          } else {
            stryCov_9fa48("594");
            const response = await axios.get(stryMutAct_9fa48("595") ? "" : (stryCov_9fa48("595"), "/api/currentUser"));

            try {
              if (stryMutAct_9fa48("596")) {
                {}
              } else {
                stryCov_9fa48("596");
                rolesList = response.data.roles.map(stryMutAct_9fa48("597") ? () => undefined : (stryCov_9fa48("597"), r => r.authority));
              }
            } catch (e) {
              if (stryMutAct_9fa48("598")) {
                {}
              } else {
                stryCov_9fa48("598");
                console.error(stryMutAct_9fa48("599") ? "" : (stryCov_9fa48("599"), "Error getting roles: "), e);
              }
            }

            response.data = stryMutAct_9fa48("600") ? {} : (stryCov_9fa48("600"), { ...response.data,
              rolesList: rolesList
            });
            return stryMutAct_9fa48("601") ? {} : (stryCov_9fa48("601"), {
              loggedIn: stryMutAct_9fa48("602") ? false : (stryCov_9fa48("602"), true),
              root: response.data
            });
          }
        } catch (e) {
          if (stryMutAct_9fa48("603")) {
            {}
          } else {
            stryCov_9fa48("603");
            console.error(stryMutAct_9fa48("604") ? "" : (stryCov_9fa48("604"), "Error invoking axios.get: "), e);
            return stryMutAct_9fa48("605") ? {} : (stryCov_9fa48("605"), {
              loggedIn: stryMutAct_9fa48("606") ? true : (stryCov_9fa48("606"), false),
              root: null
            });
          }
        }
      }
    }, stryMutAct_9fa48("607") ? {} : (stryCov_9fa48("607"), {
      initialData: stryMutAct_9fa48("608") ? {} : (stryCov_9fa48("608"), {
        loggedIn: stryMutAct_9fa48("609") ? true : (stryCov_9fa48("609"), false),
        root: null,
        initialData: stryMutAct_9fa48("610") ? false : (stryCov_9fa48("610"), true)
      })
    }));
  }
}
export function useLogout() {
  if (stryMutAct_9fa48("611")) {
    {}
  } else {
    stryCov_9fa48("611");
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const mutation = useMutation(async () => {
      if (stryMutAct_9fa48("612")) {
        {}
      } else {
        stryCov_9fa48("612");
        await axios.post(stryMutAct_9fa48("613") ? "" : (stryCov_9fa48("613"), "/logout"));
        await queryClient.resetQueries(stryMutAct_9fa48("614") ? "" : (stryCov_9fa48("614"), "current user"), stryMutAct_9fa48("615") ? {} : (stryCov_9fa48("615"), {
          exact: stryMutAct_9fa48("616") ? false : (stryCov_9fa48("616"), true)
        }));
        navigate(stryMutAct_9fa48("617") ? "" : (stryCov_9fa48("617"), "/"));
      }
    });
    return mutation;
  }
}
export function hasRole(currentUser, role) {
  if (stryMutAct_9fa48("618")) {
    {}
  } else {
    stryCov_9fa48("618");
    // The following hack is because there is some bug in terms of the
    // shape of the data returned by useCurrentUser.  Is there a separate 
    // data level, or not? 
    // We will file an issue to track that down and then remove this hack
    if (stryMutAct_9fa48("621") ? currentUser != null : stryMutAct_9fa48("620") ? false : stryMutAct_9fa48("619") ? true : (stryCov_9fa48("619", "620", "621"), currentUser == null)) return stryMutAct_9fa48("622") ? true : (stryCov_9fa48("622"), false);

    if (stryMutAct_9fa48("625") ? "data" in currentUser && "root" in currentUser.data && currentUser.data.root != null || "rolesList" in currentUser.data.root : stryMutAct_9fa48("624") ? false : stryMutAct_9fa48("623") ? true : (stryCov_9fa48("623", "624", "625"), (stryMutAct_9fa48("627") ? "data" in currentUser && "root" in currentUser.data || currentUser.data.root != null : stryMutAct_9fa48("626") ? true : (stryCov_9fa48("626", "627"), (stryMutAct_9fa48("629") ? "data" in currentUser || "root" in currentUser.data : stryMutAct_9fa48("628") ? true : (stryCov_9fa48("628", "629"), (stryMutAct_9fa48("630") ? "" : (stryCov_9fa48("630"), "data")) in currentUser && (stryMutAct_9fa48("631") ? "" : (stryCov_9fa48("631"), "root")) in currentUser.data)) && (stryMutAct_9fa48("633") ? currentUser.data.root == null : stryMutAct_9fa48("632") ? true : (stryCov_9fa48("632", "633"), currentUser.data.root != null)))) && (stryMutAct_9fa48("634") ? "" : (stryCov_9fa48("634"), "rolesList")) in currentUser.data.root)) {
      if (stryMutAct_9fa48("635")) {
        {}
      } else {
        stryCov_9fa48("635");
        return currentUser.data.root.rolesList.includes(role);
      }
    }

    return stryMutAct_9fa48("637") ? currentUser.root.rolesList?.includes(role) : stryMutAct_9fa48("636") ? currentUser.root?.rolesList.includes(role) : (stryCov_9fa48("636", "637"), currentUser.root?.rolesList?.includes(role));
  }
}