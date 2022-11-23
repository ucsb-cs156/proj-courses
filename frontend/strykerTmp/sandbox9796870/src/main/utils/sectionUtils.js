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

import { hhmmTohhmma, convertToTimeRange } from "main/utils/timeUtils.js";
export const convertToFraction = (en1, en2) => {
  if (stryMutAct_9fa48("695")) {
    {}
  } else {
    stryCov_9fa48("695");
    return (stryMutAct_9fa48("698") ? en1 != null || en2 != null : stryMutAct_9fa48("697") ? false : stryMutAct_9fa48("696") ? true : (stryCov_9fa48("696", "697", "698"), (stryMutAct_9fa48("700") ? en1 == null : stryMutAct_9fa48("699") ? true : (stryCov_9fa48("699", "700"), en1 != null)) && (stryMutAct_9fa48("702") ? en2 == null : stryMutAct_9fa48("701") ? true : (stryCov_9fa48("701", "702"), en2 != null)))) ? stryMutAct_9fa48("703") ? `` : (stryCov_9fa48("703"), `${en1}/${en2}`) : stryMutAct_9fa48("704") ? "Stryker was here!" : (stryCov_9fa48("704"), "");
  }
}; // Takes a time location array and returns the locations

export const formatLocation = timeLocationArray => {
  if (stryMutAct_9fa48("705")) {
    {}
  } else {
    stryCov_9fa48("705");

    try {
      if (stryMutAct_9fa48("706")) {
        {}
      } else {
        stryCov_9fa48("706");
        let res = stryMutAct_9fa48("707") ? "Stryker was here!" : (stryCov_9fa48("707"), "");

        for (let index = 0; stryMutAct_9fa48("710") ? index >= timeLocationArray.length : stryMutAct_9fa48("709") ? index <= timeLocationArray.length : stryMutAct_9fa48("708") ? false : (stryCov_9fa48("708", "709", "710"), index < timeLocationArray.length); stryMutAct_9fa48("711") ? index-- : (stryCov_9fa48("711"), index++)) {
          if (stryMutAct_9fa48("712")) {
            {}
          } else {
            stryCov_9fa48("712");
            res += stryMutAct_9fa48("713") ? `` : (stryCov_9fa48("713"), `${timeLocationArray[index].building} ${timeLocationArray[index].room}`);

            if (stryMutAct_9fa48("717") ? index + 1 >= timeLocationArray.length : stryMutAct_9fa48("716") ? index + 1 <= timeLocationArray.length : stryMutAct_9fa48("715") ? false : stryMutAct_9fa48("714") ? true : (stryCov_9fa48("714", "715", "716", "717"), (stryMutAct_9fa48("718") ? index - 1 : (stryCov_9fa48("718"), index + 1)) < timeLocationArray.length)) {
              if (stryMutAct_9fa48("719")) {
                {}
              } else {
                stryCov_9fa48("719");
                res += stryMutAct_9fa48("720") ? `` : (stryCov_9fa48("720"), `, `);
              }
            }
          }
        }

        return res;
      }
    } catch {
      if (stryMutAct_9fa48("721")) {
        {}
      } else {
        stryCov_9fa48("721");
        return stryMutAct_9fa48("722") ? "Stryker was here!" : (stryCov_9fa48("722"), "");
      }
    }
  }
}; // Takes a time location array and returns the days

export const formatDays = timeLocationArray => {
  if (stryMutAct_9fa48("723")) {
    {}
  } else {
    stryCov_9fa48("723");

    try {
      if (stryMutAct_9fa48("724")) {
        {}
      } else {
        stryCov_9fa48("724");
        let res = stryMutAct_9fa48("725") ? "Stryker was here!" : (stryCov_9fa48("725"), "");

        for (let index = 0; stryMutAct_9fa48("728") ? index >= timeLocationArray.length : stryMutAct_9fa48("727") ? index <= timeLocationArray.length : stryMutAct_9fa48("726") ? false : (stryCov_9fa48("726", "727", "728"), index < timeLocationArray.length); stryMutAct_9fa48("729") ? index-- : (stryCov_9fa48("729"), index++)) {
          if (stryMutAct_9fa48("730")) {
            {}
          } else {
            stryCov_9fa48("730");
            stryMutAct_9fa48("731") ? res -= (stryMutAct_9fa48("734") ? timeLocationArray[index].days === null : stryMutAct_9fa48("733") ? false : stryMutAct_9fa48("732") ? true : (stryCov_9fa48("732", "733", "734"), timeLocationArray[index].days !== null)) ? stryMutAct_9fa48("735") ? `` : (stryCov_9fa48("735"), `${timeLocationArray[index].days}`) : stryMutAct_9fa48("736") ? "Stryker was here!" : (stryCov_9fa48("736"), "") : (stryCov_9fa48("731"), res += (stryMutAct_9fa48("734") ? timeLocationArray[index].days === null : stryMutAct_9fa48("733") ? false : stryMutAct_9fa48("732") ? true : (stryCov_9fa48("732", "733", "734"), timeLocationArray[index].days !== null)) ? stryMutAct_9fa48("735") ? `` : (stryCov_9fa48("735"), `${timeLocationArray[index].days}`) : stryMutAct_9fa48("736") ? "Stryker was here!" : (stryCov_9fa48("736"), ""));

            if (stryMutAct_9fa48("739") ? index + 1 < timeLocationArray.length || timeLocationArray[index].days !== null : stryMutAct_9fa48("738") ? false : stryMutAct_9fa48("737") ? true : (stryCov_9fa48("737", "738", "739"), (stryMutAct_9fa48("742") ? index + 1 >= timeLocationArray.length : stryMutAct_9fa48("741") ? index + 1 <= timeLocationArray.length : stryMutAct_9fa48("740") ? true : (stryCov_9fa48("740", "741", "742"), (stryMutAct_9fa48("743") ? index - 1 : (stryCov_9fa48("743"), index + 1)) < timeLocationArray.length)) && (stryMutAct_9fa48("745") ? timeLocationArray[index].days === null : stryMutAct_9fa48("744") ? true : (stryCov_9fa48("744", "745"), timeLocationArray[index].days !== null)))) {
              if (stryMutAct_9fa48("746")) {
                {}
              } else {
                stryCov_9fa48("746");
                res += stryMutAct_9fa48("747") ? `` : (stryCov_9fa48("747"), `, `);
              }
            }
          }
        }

        return res;
      }
    } catch {
      if (stryMutAct_9fa48("748")) {
        {}
      } else {
        stryCov_9fa48("748");
        return stryMutAct_9fa48("749") ? "Stryker was here!" : (stryCov_9fa48("749"), "");
      }
    }
  }
}; // Takes a time location array and returns the time range

export const formatTime = timeLocationArray => {
  if (stryMutAct_9fa48("750")) {
    {}
  } else {
    stryCov_9fa48("750");

    try {
      if (stryMutAct_9fa48("751")) {
        {}
      } else {
        stryCov_9fa48("751");
        let res = stryMutAct_9fa48("752") ? "Stryker was here!" : (stryCov_9fa48("752"), "");

        for (let index = 0; stryMutAct_9fa48("755") ? index >= timeLocationArray.length : stryMutAct_9fa48("754") ? index <= timeLocationArray.length : stryMutAct_9fa48("753") ? false : (stryCov_9fa48("753", "754", "755"), index < timeLocationArray.length); stryMutAct_9fa48("756") ? index-- : (stryCov_9fa48("756"), index++)) {
          if (stryMutAct_9fa48("757")) {
            {}
          } else {
            stryCov_9fa48("757");
            stryMutAct_9fa48("758") ? res -= convertToTimeRange(hhmmTohhmma(timeLocationArray[index].beginTime), hhmmTohhmma(timeLocationArray[index].endTime)) : (stryCov_9fa48("758"), res += convertToTimeRange(hhmmTohhmma(timeLocationArray[index].beginTime), hhmmTohhmma(timeLocationArray[index].endTime)));

            if (stryMutAct_9fa48("762") ? index + 1 >= timeLocationArray.length : stryMutAct_9fa48("761") ? index + 1 <= timeLocationArray.length : stryMutAct_9fa48("760") ? false : stryMutAct_9fa48("759") ? true : (stryCov_9fa48("759", "760", "761", "762"), (stryMutAct_9fa48("763") ? index - 1 : (stryCov_9fa48("763"), index + 1)) < timeLocationArray.length)) {
              if (stryMutAct_9fa48("764")) {
                {}
              } else {
                stryCov_9fa48("764");
                res += stryMutAct_9fa48("765") ? `` : (stryCov_9fa48("765"), `, `);
              }
            }
          }
        }

        return res;
      }
    } catch {
      if (stryMutAct_9fa48("766")) {
        {}
      } else {
        stryCov_9fa48("766");
        return stryMutAct_9fa48("767") ? "Stryker was here!" : (stryCov_9fa48("767"), "");
      }
    }
  }
}; // Takes a instructors array and returns the instructors

export const formatInstructors = instructorArray => {
  if (stryMutAct_9fa48("768")) {
    {}
  } else {
    stryCov_9fa48("768");

    try {
      if (stryMutAct_9fa48("769")) {
        {}
      } else {
        stryCov_9fa48("769");
        let res = stryMutAct_9fa48("770") ? "Stryker was here!" : (stryCov_9fa48("770"), "");

        for (let index = 0; stryMutAct_9fa48("773") ? index >= instructorArray.length : stryMutAct_9fa48("772") ? index <= instructorArray.length : stryMutAct_9fa48("771") ? false : (stryCov_9fa48("771", "772", "773"), index < instructorArray.length); stryMutAct_9fa48("774") ? index-- : (stryCov_9fa48("774"), index++)) {
          if (stryMutAct_9fa48("775")) {
            {}
          } else {
            stryCov_9fa48("775");
            res += stryMutAct_9fa48("776") ? `` : (stryCov_9fa48("776"), `${instructorArray[index].instructor}`);

            if (stryMutAct_9fa48("780") ? index + 1 >= instructorArray.length : stryMutAct_9fa48("779") ? index + 1 <= instructorArray.length : stryMutAct_9fa48("778") ? false : stryMutAct_9fa48("777") ? true : (stryCov_9fa48("777", "778", "779", "780"), (stryMutAct_9fa48("781") ? index - 1 : (stryCov_9fa48("781"), index + 1)) < instructorArray.length)) {
              if (stryMutAct_9fa48("782")) {
                {}
              } else {
                stryCov_9fa48("782");
                res += stryMutAct_9fa48("783") ? `` : (stryCov_9fa48("783"), `, `);
              }
            }
          }
        }

        return res;
      }
    } catch {
      if (stryMutAct_9fa48("784")) {
        {}
      } else {
        stryCov_9fa48("784");
        return stryMutAct_9fa48("785") ? "Stryker was here!" : (stryCov_9fa48("785"), "");
      }
    }
  }
};
export const isSection = en1 => {
  if (stryMutAct_9fa48("786")) {
    {}
  } else {
    stryCov_9fa48("786");
    return stryMutAct_9fa48("789") ? en1.substring(2) === "00" : stryMutAct_9fa48("788") ? false : stryMutAct_9fa48("787") ? true : (stryCov_9fa48("787", "788", "789"), en1.substring(2) !== (stryMutAct_9fa48("790") ? "" : (stryCov_9fa48("790"), "00")));
  }
};