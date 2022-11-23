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
  if (stryMutAct_9fa48("714")) {
    {}
  } else {
    stryCov_9fa48("714");
    return (stryMutAct_9fa48("717") ? en1 != null || en2 != null : stryMutAct_9fa48("716") ? false : stryMutAct_9fa48("715") ? true : (stryCov_9fa48("715", "716", "717"), (stryMutAct_9fa48("719") ? en1 == null : stryMutAct_9fa48("718") ? true : (stryCov_9fa48("718", "719"), en1 != null)) && (stryMutAct_9fa48("721") ? en2 == null : stryMutAct_9fa48("720") ? true : (stryCov_9fa48("720", "721"), en2 != null)))) ? stryMutAct_9fa48("722") ? `` : (stryCov_9fa48("722"), `${en1}/${en2}`) : stryMutAct_9fa48("723") ? "Stryker was here!" : (stryCov_9fa48("723"), "");
  }
}; // Takes a time location array and returns the locations

export const formatLocation = timeLocationArray => {
  if (stryMutAct_9fa48("724")) {
    {}
  } else {
    stryCov_9fa48("724");

    try {
      if (stryMutAct_9fa48("725")) {
        {}
      } else {
        stryCov_9fa48("725");
        let res = stryMutAct_9fa48("726") ? "Stryker was here!" : (stryCov_9fa48("726"), "");

        for (let index = 0; stryMutAct_9fa48("729") ? index >= timeLocationArray.length : stryMutAct_9fa48("728") ? index <= timeLocationArray.length : stryMutAct_9fa48("727") ? false : (stryCov_9fa48("727", "728", "729"), index < timeLocationArray.length); stryMutAct_9fa48("730") ? index-- : (stryCov_9fa48("730"), index++)) {
          if (stryMutAct_9fa48("731")) {
            {}
          } else {
            stryCov_9fa48("731");
            res += stryMutAct_9fa48("732") ? `` : (stryCov_9fa48("732"), `${timeLocationArray[index].building} ${timeLocationArray[index].room}`);

            if (stryMutAct_9fa48("736") ? index + 1 >= timeLocationArray.length : stryMutAct_9fa48("735") ? index + 1 <= timeLocationArray.length : stryMutAct_9fa48("734") ? false : stryMutAct_9fa48("733") ? true : (stryCov_9fa48("733", "734", "735", "736"), (stryMutAct_9fa48("737") ? index - 1 : (stryCov_9fa48("737"), index + 1)) < timeLocationArray.length)) {
              if (stryMutAct_9fa48("738")) {
                {}
              } else {
                stryCov_9fa48("738");
                res += stryMutAct_9fa48("739") ? `` : (stryCov_9fa48("739"), `, `);
              }
            }
          }
        }

        return res;
      }
    } catch {
      if (stryMutAct_9fa48("740")) {
        {}
      } else {
        stryCov_9fa48("740");
        return stryMutAct_9fa48("741") ? "Stryker was here!" : (stryCov_9fa48("741"), "");
      }
    }
  }
}; // Takes a time location array and returns the days

export const formatDays = timeLocationArray => {
  if (stryMutAct_9fa48("742")) {
    {}
  } else {
    stryCov_9fa48("742");

    try {
      if (stryMutAct_9fa48("743")) {
        {}
      } else {
        stryCov_9fa48("743");
        let res = stryMutAct_9fa48("744") ? "Stryker was here!" : (stryCov_9fa48("744"), "");

        for (let index = 0; stryMutAct_9fa48("747") ? index >= timeLocationArray.length : stryMutAct_9fa48("746") ? index <= timeLocationArray.length : stryMutAct_9fa48("745") ? false : (stryCov_9fa48("745", "746", "747"), index < timeLocationArray.length); stryMutAct_9fa48("748") ? index-- : (stryCov_9fa48("748"), index++)) {
          if (stryMutAct_9fa48("749")) {
            {}
          } else {
            stryCov_9fa48("749");
            stryMutAct_9fa48("750") ? res -= (stryMutAct_9fa48("753") ? timeLocationArray[index].days === null : stryMutAct_9fa48("752") ? false : stryMutAct_9fa48("751") ? true : (stryCov_9fa48("751", "752", "753"), timeLocationArray[index].days !== null)) ? stryMutAct_9fa48("754") ? `` : (stryCov_9fa48("754"), `${timeLocationArray[index].days}`) : stryMutAct_9fa48("755") ? "Stryker was here!" : (stryCov_9fa48("755"), "") : (stryCov_9fa48("750"), res += (stryMutAct_9fa48("753") ? timeLocationArray[index].days === null : stryMutAct_9fa48("752") ? false : stryMutAct_9fa48("751") ? true : (stryCov_9fa48("751", "752", "753"), timeLocationArray[index].days !== null)) ? stryMutAct_9fa48("754") ? `` : (stryCov_9fa48("754"), `${timeLocationArray[index].days}`) : stryMutAct_9fa48("755") ? "Stryker was here!" : (stryCov_9fa48("755"), ""));

            if (stryMutAct_9fa48("758") ? index + 1 < timeLocationArray.length || timeLocationArray[index].days !== null : stryMutAct_9fa48("757") ? false : stryMutAct_9fa48("756") ? true : (stryCov_9fa48("756", "757", "758"), (stryMutAct_9fa48("761") ? index + 1 >= timeLocationArray.length : stryMutAct_9fa48("760") ? index + 1 <= timeLocationArray.length : stryMutAct_9fa48("759") ? true : (stryCov_9fa48("759", "760", "761"), (stryMutAct_9fa48("762") ? index - 1 : (stryCov_9fa48("762"), index + 1)) < timeLocationArray.length)) && (stryMutAct_9fa48("764") ? timeLocationArray[index].days === null : stryMutAct_9fa48("763") ? true : (stryCov_9fa48("763", "764"), timeLocationArray[index].days !== null)))) {
              if (stryMutAct_9fa48("765")) {
                {}
              } else {
                stryCov_9fa48("765");
                res += stryMutAct_9fa48("766") ? `` : (stryCov_9fa48("766"), `, `);
              }
            }
          }
        }

        return res;
      }
    } catch {
      if (stryMutAct_9fa48("767")) {
        {}
      } else {
        stryCov_9fa48("767");
        return stryMutAct_9fa48("768") ? "Stryker was here!" : (stryCov_9fa48("768"), "");
      }
    }
  }
}; // Takes a time location array and returns the time range

export const formatTime = timeLocationArray => {
  if (stryMutAct_9fa48("769")) {
    {}
  } else {
    stryCov_9fa48("769");

    try {
      if (stryMutAct_9fa48("770")) {
        {}
      } else {
        stryCov_9fa48("770");
        let res = stryMutAct_9fa48("771") ? "Stryker was here!" : (stryCov_9fa48("771"), "");

        for (let index = 0; stryMutAct_9fa48("774") ? index >= timeLocationArray.length : stryMutAct_9fa48("773") ? index <= timeLocationArray.length : stryMutAct_9fa48("772") ? false : (stryCov_9fa48("772", "773", "774"), index < timeLocationArray.length); stryMutAct_9fa48("775") ? index-- : (stryCov_9fa48("775"), index++)) {
          if (stryMutAct_9fa48("776")) {
            {}
          } else {
            stryCov_9fa48("776");
            stryMutAct_9fa48("777") ? res -= convertToTimeRange(hhmmTohhmma(timeLocationArray[index].beginTime), hhmmTohhmma(timeLocationArray[index].endTime)) : (stryCov_9fa48("777"), res += convertToTimeRange(hhmmTohhmma(timeLocationArray[index].beginTime), hhmmTohhmma(timeLocationArray[index].endTime)));

            if (stryMutAct_9fa48("781") ? index + 1 >= timeLocationArray.length : stryMutAct_9fa48("780") ? index + 1 <= timeLocationArray.length : stryMutAct_9fa48("779") ? false : stryMutAct_9fa48("778") ? true : (stryCov_9fa48("778", "779", "780", "781"), (stryMutAct_9fa48("782") ? index - 1 : (stryCov_9fa48("782"), index + 1)) < timeLocationArray.length)) {
              if (stryMutAct_9fa48("783")) {
                {}
              } else {
                stryCov_9fa48("783");
                res += stryMutAct_9fa48("784") ? `` : (stryCov_9fa48("784"), `, `);
              }
            }
          }
        }

        return res;
      }
    } catch {
      if (stryMutAct_9fa48("785")) {
        {}
      } else {
        stryCov_9fa48("785");
        return stryMutAct_9fa48("786") ? "Stryker was here!" : (stryCov_9fa48("786"), "");
      }
    }
  }
}; // Takes a instructors array and returns the instructors

export const formatInstructors = instructorArray => {
  if (stryMutAct_9fa48("787")) {
    {}
  } else {
    stryCov_9fa48("787");

    try {
      if (stryMutAct_9fa48("788")) {
        {}
      } else {
        stryCov_9fa48("788");
        let res = stryMutAct_9fa48("789") ? "Stryker was here!" : (stryCov_9fa48("789"), "");

        for (let index = 0; stryMutAct_9fa48("792") ? index >= instructorArray.length : stryMutAct_9fa48("791") ? index <= instructorArray.length : stryMutAct_9fa48("790") ? false : (stryCov_9fa48("790", "791", "792"), index < instructorArray.length); stryMutAct_9fa48("793") ? index-- : (stryCov_9fa48("793"), index++)) {
          if (stryMutAct_9fa48("794")) {
            {}
          } else {
            stryCov_9fa48("794");
            res += stryMutAct_9fa48("795") ? `` : (stryCov_9fa48("795"), `${instructorArray[index].instructor}`);

            if (stryMutAct_9fa48("799") ? index + 1 >= instructorArray.length : stryMutAct_9fa48("798") ? index + 1 <= instructorArray.length : stryMutAct_9fa48("797") ? false : stryMutAct_9fa48("796") ? true : (stryCov_9fa48("796", "797", "798", "799"), (stryMutAct_9fa48("800") ? index - 1 : (stryCov_9fa48("800"), index + 1)) < instructorArray.length)) {
              if (stryMutAct_9fa48("801")) {
                {}
              } else {
                stryCov_9fa48("801");
                res += stryMutAct_9fa48("802") ? `` : (stryCov_9fa48("802"), `, `);
              }
            }
          }
        }

        return res;
      }
    } catch {
      if (stryMutAct_9fa48("803")) {
        {}
      } else {
        stryCov_9fa48("803");
        return stryMutAct_9fa48("804") ? "Stryker was here!" : (stryCov_9fa48("804"), "");
      }
    }
  }
};
export const isSection = en1 => {
  if (stryMutAct_9fa48("805")) {
    {}
  } else {
    stryCov_9fa48("805");
    return stryMutAct_9fa48("808") ? en1.substring(2) === "00" : stryMutAct_9fa48("807") ? false : stryMutAct_9fa48("806") ? true : (stryCov_9fa48("806", "807", "808"), en1.substring(2) !== (stryMutAct_9fa48("809") ? "" : (stryCov_9fa48("809"), "00")));
  }
};