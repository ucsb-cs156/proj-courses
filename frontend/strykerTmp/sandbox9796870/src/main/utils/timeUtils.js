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
  if (stryMutAct_9fa48("844")) {
    {}
  } else {
    stryCov_9fa48("844");

    if (stryMutAct_9fa48("847") ? HHMM !== null : stryMutAct_9fa48("846") ? false : stryMutAct_9fa48("845") ? true : (stryCov_9fa48("845", "846", "847"), HHMM === null)) {
      if (stryMutAct_9fa48("848")) {
        {}
      } else {
        stryCov_9fa48("848");
        return stryMutAct_9fa48("849") ? "Stryker was here!" : (stryCov_9fa48("849"), "");
      }
    }

    var time = HHMM.split(stryMutAct_9fa48("850") ? "" : (stryCov_9fa48("850"), ':'));
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var timeValue;

    if (stryMutAct_9fa48("853") ? minutes > 59 && minutes < 0 : stryMutAct_9fa48("852") ? false : stryMutAct_9fa48("851") ? true : (stryCov_9fa48("851", "852", "853"), (stryMutAct_9fa48("856") ? minutes <= 59 : stryMutAct_9fa48("855") ? minutes >= 59 : stryMutAct_9fa48("854") ? false : (stryCov_9fa48("854", "855", "856"), minutes > 59)) || (stryMutAct_9fa48("859") ? minutes >= 0 : stryMutAct_9fa48("858") ? minutes <= 0 : stryMutAct_9fa48("857") ? false : (stryCov_9fa48("857", "858", "859"), minutes < 0)))) {
      if (stryMutAct_9fa48("860")) {
        {}
      } else {
        stryCov_9fa48("860");
        return stryMutAct_9fa48("861") ? "Stryker was here!" : (stryCov_9fa48("861"), "");
      }
    }

    if (stryMutAct_9fa48("864") ? hours > 12 || hours < 24 : stryMutAct_9fa48("863") ? false : stryMutAct_9fa48("862") ? true : (stryCov_9fa48("862", "863", "864"), (stryMutAct_9fa48("867") ? hours <= 12 : stryMutAct_9fa48("866") ? hours >= 12 : stryMutAct_9fa48("865") ? true : (stryCov_9fa48("865", "866", "867"), hours > 12)) && (stryMutAct_9fa48("870") ? hours >= 24 : stryMutAct_9fa48("869") ? hours <= 24 : stryMutAct_9fa48("868") ? true : (stryCov_9fa48("868", "869", "870"), hours < 24)))) {
      if (stryMutAct_9fa48("871")) {
        {}
      } else {
        stryCov_9fa48("871");
        timeValue = (stryMutAct_9fa48("872") ? "Stryker was here!" : (stryCov_9fa48("872"), "")) + (stryMutAct_9fa48("873") ? hours + 12 : (stryCov_9fa48("873"), hours - 12));
      }
    } else if (stryMutAct_9fa48("876") ? hours > 0 || hours <= 12 : stryMutAct_9fa48("875") ? false : stryMutAct_9fa48("874") ? true : (stryCov_9fa48("874", "875", "876"), (stryMutAct_9fa48("879") ? hours <= 0 : stryMutAct_9fa48("878") ? hours >= 0 : stryMutAct_9fa48("877") ? true : (stryCov_9fa48("877", "878", "879"), hours > 0)) && (stryMutAct_9fa48("882") ? hours > 12 : stryMutAct_9fa48("881") ? hours < 12 : stryMutAct_9fa48("880") ? true : (stryCov_9fa48("880", "881", "882"), hours <= 12)))) {
      if (stryMutAct_9fa48("883")) {
        {}
      } else {
        stryCov_9fa48("883");
        timeValue = (stryMutAct_9fa48("884") ? "Stryker was here!" : (stryCov_9fa48("884"), "")) + hours;
      }
    } else if (stryMutAct_9fa48("887") ? hours !== 0 : stryMutAct_9fa48("886") ? false : stryMutAct_9fa48("885") ? true : (stryCov_9fa48("885", "886", "887"), hours === 0)) {
      if (stryMutAct_9fa48("888")) {
        {}
      } else {
        stryCov_9fa48("888");
        timeValue = stryMutAct_9fa48("889") ? "" : (stryCov_9fa48("889"), "12");
      }
    } else {
      if (stryMutAct_9fa48("890")) {
        {}
      } else {
        stryCov_9fa48("890");
        return stryMutAct_9fa48("891") ? "Stryker was here!" : (stryCov_9fa48("891"), "");
      }
    }

    stryMutAct_9fa48("892") ? timeValue -= (stryMutAct_9fa48("896") ? minutes >= 10 : stryMutAct_9fa48("895") ? minutes <= 10 : stryMutAct_9fa48("894") ? false : stryMutAct_9fa48("893") ? true : (stryCov_9fa48("893", "894", "895", "896"), minutes < 10)) ? (stryMutAct_9fa48("897") ? "" : (stryCov_9fa48("897"), ":0")) + minutes : (stryMutAct_9fa48("898") ? "" : (stryCov_9fa48("898"), ":")) + minutes : (stryCov_9fa48("892"), timeValue += (stryMutAct_9fa48("896") ? minutes >= 10 : stryMutAct_9fa48("895") ? minutes <= 10 : stryMutAct_9fa48("894") ? false : stryMutAct_9fa48("893") ? true : (stryCov_9fa48("893", "894", "895", "896"), minutes < 10)) ? (stryMutAct_9fa48("897") ? "" : (stryCov_9fa48("897"), ":0")) + minutes : (stryMutAct_9fa48("898") ? "" : (stryCov_9fa48("898"), ":")) + minutes); // get minutes

    stryMutAct_9fa48("899") ? timeValue -= (stryMutAct_9fa48("903") ? hours < 12 : stryMutAct_9fa48("902") ? hours > 12 : stryMutAct_9fa48("901") ? false : stryMutAct_9fa48("900") ? true : (stryCov_9fa48("900", "901", "902", "903"), hours >= 12)) ? stryMutAct_9fa48("904") ? "" : (stryCov_9fa48("904"), " PM") : stryMutAct_9fa48("905") ? "" : (stryCov_9fa48("905"), " AM") : (stryCov_9fa48("899"), timeValue += (stryMutAct_9fa48("903") ? hours < 12 : stryMutAct_9fa48("902") ? hours > 12 : stryMutAct_9fa48("901") ? false : stryMutAct_9fa48("900") ? true : (stryCov_9fa48("900", "901", "902", "903"), hours >= 12)) ? stryMutAct_9fa48("904") ? "" : (stryCov_9fa48("904"), " PM") : stryMutAct_9fa48("905") ? "" : (stryCov_9fa48("905"), " AM")); // get AM/PM

    return timeValue;
  }
};
export const convertToTimeRange = (time1, time2) => {
  if (stryMutAct_9fa48("906")) {
    {}
  } else {
    stryCov_9fa48("906");
    return (stryMutAct_9fa48("909") ? time1 !== "" || time2 !== "" : stryMutAct_9fa48("908") ? false : stryMutAct_9fa48("907") ? true : (stryCov_9fa48("907", "908", "909"), (stryMutAct_9fa48("911") ? time1 === "" : stryMutAct_9fa48("910") ? true : (stryCov_9fa48("910", "911"), time1 !== (stryMutAct_9fa48("912") ? "Stryker was here!" : (stryCov_9fa48("912"), "")))) && (stryMutAct_9fa48("914") ? time2 === "" : stryMutAct_9fa48("913") ? true : (stryCov_9fa48("913", "914"), time2 !== (stryMutAct_9fa48("915") ? "Stryker was here!" : (stryCov_9fa48("915"), "")))))) ? stryMutAct_9fa48("916") ? `` : (stryCov_9fa48("916"), `${time1} - ${time2}`) : stryMutAct_9fa48("917") ? "Stryker was here!" : (stryCov_9fa48("917"), "");
  }
};