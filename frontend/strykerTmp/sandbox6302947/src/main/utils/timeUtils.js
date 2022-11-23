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

export const hhmmTohhmma = HHMM => {
  if (stryMutAct_9fa48("863")) {
    {}
  } else {
    stryCov_9fa48("863");

    if (stryMutAct_9fa48("866") ? HHMM !== null : stryMutAct_9fa48("865") ? false : stryMutAct_9fa48("864") ? true : (stryCov_9fa48("864", "865", "866"), HHMM === null)) {
      if (stryMutAct_9fa48("867")) {
        {}
      } else {
        stryCov_9fa48("867");
        return stryMutAct_9fa48("868") ? "Stryker was here!" : (stryCov_9fa48("868"), "");
      }
    }

    var time = HHMM.split(stryMutAct_9fa48("869") ? "" : (stryCov_9fa48("869"), ':'));
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var timeValue;

    if (stryMutAct_9fa48("872") ? minutes > 59 && minutes < 0 : stryMutAct_9fa48("871") ? false : stryMutAct_9fa48("870") ? true : (stryCov_9fa48("870", "871", "872"), (stryMutAct_9fa48("875") ? minutes <= 59 : stryMutAct_9fa48("874") ? minutes >= 59 : stryMutAct_9fa48("873") ? false : (stryCov_9fa48("873", "874", "875"), minutes > 59)) || (stryMutAct_9fa48("878") ? minutes >= 0 : stryMutAct_9fa48("877") ? minutes <= 0 : stryMutAct_9fa48("876") ? false : (stryCov_9fa48("876", "877", "878"), minutes < 0)))) {
      if (stryMutAct_9fa48("879")) {
        {}
      } else {
        stryCov_9fa48("879");
        return stryMutAct_9fa48("880") ? "Stryker was here!" : (stryCov_9fa48("880"), "");
      }
    }

    if (stryMutAct_9fa48("883") ? hours > 12 || hours < 24 : stryMutAct_9fa48("882") ? false : stryMutAct_9fa48("881") ? true : (stryCov_9fa48("881", "882", "883"), (stryMutAct_9fa48("886") ? hours <= 12 : stryMutAct_9fa48("885") ? hours >= 12 : stryMutAct_9fa48("884") ? true : (stryCov_9fa48("884", "885", "886"), hours > 12)) && (stryMutAct_9fa48("889") ? hours >= 24 : stryMutAct_9fa48("888") ? hours <= 24 : stryMutAct_9fa48("887") ? true : (stryCov_9fa48("887", "888", "889"), hours < 24)))) {
      if (stryMutAct_9fa48("890")) {
        {}
      } else {
        stryCov_9fa48("890");
        timeValue = (stryMutAct_9fa48("891") ? "Stryker was here!" : (stryCov_9fa48("891"), "")) + (stryMutAct_9fa48("892") ? hours + 12 : (stryCov_9fa48("892"), hours - 12));
      }
    } else if (stryMutAct_9fa48("895") ? hours > 0 || hours <= 12 : stryMutAct_9fa48("894") ? false : stryMutAct_9fa48("893") ? true : (stryCov_9fa48("893", "894", "895"), (stryMutAct_9fa48("898") ? hours <= 0 : stryMutAct_9fa48("897") ? hours >= 0 : stryMutAct_9fa48("896") ? true : (stryCov_9fa48("896", "897", "898"), hours > 0)) && (stryMutAct_9fa48("901") ? hours > 12 : stryMutAct_9fa48("900") ? hours < 12 : stryMutAct_9fa48("899") ? true : (stryCov_9fa48("899", "900", "901"), hours <= 12)))) {
      if (stryMutAct_9fa48("902")) {
        {}
      } else {
        stryCov_9fa48("902");
        timeValue = (stryMutAct_9fa48("903") ? "Stryker was here!" : (stryCov_9fa48("903"), "")) + hours;
      }
    } else if (stryMutAct_9fa48("906") ? hours !== 0 : stryMutAct_9fa48("905") ? false : stryMutAct_9fa48("904") ? true : (stryCov_9fa48("904", "905", "906"), hours === 0)) {
      if (stryMutAct_9fa48("907")) {
        {}
      } else {
        stryCov_9fa48("907");
        timeValue = stryMutAct_9fa48("908") ? "" : (stryCov_9fa48("908"), "12");
      }
    } else {
      if (stryMutAct_9fa48("909")) {
        {}
      } else {
        stryCov_9fa48("909");
        return stryMutAct_9fa48("910") ? "Stryker was here!" : (stryCov_9fa48("910"), "");
      }
    }

    stryMutAct_9fa48("911") ? timeValue -= (stryMutAct_9fa48("915") ? minutes >= 10 : stryMutAct_9fa48("914") ? minutes <= 10 : stryMutAct_9fa48("913") ? false : stryMutAct_9fa48("912") ? true : (stryCov_9fa48("912", "913", "914", "915"), minutes < 10)) ? (stryMutAct_9fa48("916") ? "" : (stryCov_9fa48("916"), ":0")) + minutes : (stryMutAct_9fa48("917") ? "" : (stryCov_9fa48("917"), ":")) + minutes : (stryCov_9fa48("911"), timeValue += (stryMutAct_9fa48("915") ? minutes >= 10 : stryMutAct_9fa48("914") ? minutes <= 10 : stryMutAct_9fa48("913") ? false : stryMutAct_9fa48("912") ? true : (stryCov_9fa48("912", "913", "914", "915"), minutes < 10)) ? (stryMutAct_9fa48("916") ? "" : (stryCov_9fa48("916"), ":0")) + minutes : (stryMutAct_9fa48("917") ? "" : (stryCov_9fa48("917"), ":")) + minutes); // get minutes

    stryMutAct_9fa48("918") ? timeValue -= (stryMutAct_9fa48("922") ? hours < 12 : stryMutAct_9fa48("921") ? hours > 12 : stryMutAct_9fa48("920") ? false : stryMutAct_9fa48("919") ? true : (stryCov_9fa48("919", "920", "921", "922"), hours >= 12)) ? stryMutAct_9fa48("923") ? "" : (stryCov_9fa48("923"), " PM") : stryMutAct_9fa48("924") ? "" : (stryCov_9fa48("924"), " AM") : (stryCov_9fa48("918"), timeValue += (stryMutAct_9fa48("922") ? hours < 12 : stryMutAct_9fa48("921") ? hours > 12 : stryMutAct_9fa48("920") ? false : stryMutAct_9fa48("919") ? true : (stryCov_9fa48("919", "920", "921", "922"), hours >= 12)) ? stryMutAct_9fa48("923") ? "" : (stryCov_9fa48("923"), " PM") : stryMutAct_9fa48("924") ? "" : (stryCov_9fa48("924"), " AM")); // get AM/PM

    return timeValue;
  }
};
export const convertToTimeRange = (time1, time2) => {
  if (stryMutAct_9fa48("925")) {
    {}
  } else {
    stryCov_9fa48("925");
    return (stryMutAct_9fa48("928") ? time1 !== "" || time2 !== "" : stryMutAct_9fa48("927") ? false : stryMutAct_9fa48("926") ? true : (stryCov_9fa48("926", "927", "928"), (stryMutAct_9fa48("930") ? time1 === "" : stryMutAct_9fa48("929") ? true : (stryCov_9fa48("929", "930"), time1 !== (stryMutAct_9fa48("931") ? "Stryker was here!" : (stryCov_9fa48("931"), "")))) && (stryMutAct_9fa48("933") ? time2 === "" : stryMutAct_9fa48("932") ? true : (stryCov_9fa48("932", "933"), time2 !== (stryMutAct_9fa48("934") ? "Stryker was here!" : (stryCov_9fa48("934"), "")))))) ? stryMutAct_9fa48("935") ? `` : (stryCov_9fa48("935"), `${time1} - ${time2}`) : stryMutAct_9fa48("936") ? "Stryker was here!" : (stryCov_9fa48("936"), "");
  }
};