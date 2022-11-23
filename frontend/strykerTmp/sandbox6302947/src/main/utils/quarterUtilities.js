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

const quarters = stryMutAct_9fa48("638") ? [] : (stryCov_9fa48("638"), [stryMutAct_9fa48("639") ? "" : (stryCov_9fa48("639"), "WINTER"), stryMutAct_9fa48("640") ? "" : (stryCov_9fa48("640"), "SPRING"), stryMutAct_9fa48("641") ? "" : (stryCov_9fa48("641"), "SUMMER"), stryMutAct_9fa48("642") ? "" : (stryCov_9fa48("642"), "FALL")]);
const shortQuarters = stryMutAct_9fa48("643") ? [] : (stryCov_9fa48("643"), [stryMutAct_9fa48("644") ? "" : (stryCov_9fa48("644"), "W"), stryMutAct_9fa48("645") ? "" : (stryCov_9fa48("645"), "S"), stryMutAct_9fa48("646") ? "" : (stryCov_9fa48("646"), "M"), stryMutAct_9fa48("647") ? "" : (stryCov_9fa48("647"), "F")]);
const qtrNumToQuarter = stryMutAct_9fa48("648") ? {} : (stryCov_9fa48("648"), {
  '1': stryMutAct_9fa48("649") ? "" : (stryCov_9fa48("649"), 'WINTER'),
  '2': stryMutAct_9fa48("650") ? "" : (stryCov_9fa48("650"), 'SPRING'),
  '3': stryMutAct_9fa48("651") ? "" : (stryCov_9fa48("651"), 'SUMMER'),
  '4': stryMutAct_9fa48("652") ? "" : (stryCov_9fa48("652"), 'FALL')
});

const yyyyqToQyy = yyyyq => {
  if (stryMutAct_9fa48("653")) {
    {}
  } else {
    stryCov_9fa48("653");
    return stryMutAct_9fa48("654") ? `` : (stryCov_9fa48("654"), `${shortQuarters[stryMutAct_9fa48("655") ? parseInt(yyyyq.charAt(4)) + 1 : (stryCov_9fa48("655"), parseInt(yyyyq.charAt(4)) - 1)]}${yyyyq.substring(2, 4)}`);
  }
};

const toFormat = (quarter, year) => {
  if (stryMutAct_9fa48("656")) {
    {}
  } else {
    stryCov_9fa48("656");
    return stryMutAct_9fa48("657") ? year.toString() - parseInt(quarter).toString() : (stryCov_9fa48("657"), year.toString() + parseInt(quarter).toString());
  }
};

const fromFormat = format => {
  if (stryMutAct_9fa48("658")) {
    {}
  } else {
    stryCov_9fa48("658");
    return stryMutAct_9fa48("659") ? `` : (stryCov_9fa48("659"), `${quarters[stryMutAct_9fa48("660") ? parseInt(format.charAt(4)) + 1 : (stryCov_9fa48("660"), parseInt(format.charAt(4)) - 1)]} ${format.substring(0, 4)}`);
  }
};

const fromNumericYYYYQ = yyyyqInt => {
  if (stryMutAct_9fa48("661")) {
    {}
  } else {
    stryCov_9fa48("661");

    if (stryMutAct_9fa48("664") ? typeof yyyyqInt == 'number' : stryMutAct_9fa48("663") ? false : stryMutAct_9fa48("662") ? true : (stryCov_9fa48("662", "663", "664"), typeof yyyyqInt != (stryMutAct_9fa48("665") ? "" : (stryCov_9fa48("665"), 'number')))) {
      if (stryMutAct_9fa48("666")) {
        {}
      } else {
        stryCov_9fa48("666");
        throw new Error(stryMutAct_9fa48("667") ? "" : (stryCov_9fa48("667"), "param should be a number"));
      }
    }

    const yyyyqStr = yyyyqInt.toString();

    if (stryMutAct_9fa48("670") ? yyyyqStr.length === 5 : stryMutAct_9fa48("669") ? false : stryMutAct_9fa48("668") ? true : (stryCov_9fa48("668", "669", "670"), yyyyqStr.length !== 5)) {
      if (stryMutAct_9fa48("671")) {
        {}
      } else {
        stryCov_9fa48("671");
        throw new Error(stryMutAct_9fa48("672") ? "" : (stryCov_9fa48("672"), "param should be five digits"));
      }
    }

    const qStr = yyyyqStr.substring(4, 5);

    if (stryMutAct_9fa48("675") ? false : stryMutAct_9fa48("674") ? true : stryMutAct_9fa48("673") ? qStr in qtrNumToQuarter : (stryCov_9fa48("673", "674", "675"), !(qStr in qtrNumToQuarter))) {
      if (stryMutAct_9fa48("676")) {
        {}
      } else {
        stryCov_9fa48("676");
        throw new Error(stryMutAct_9fa48("677") ? "" : (stryCov_9fa48("677"), "param should end in 1,2,3 or 4"));
      }
    }

    return yyyyqStr;
  }
};

const toNumericYYYYQ = yyyyqStr => {
  if (stryMutAct_9fa48("678")) {
    {}
  } else {
    stryCov_9fa48("678");

    if (stryMutAct_9fa48("681") ? typeof yyyyqStr === 'string' : stryMutAct_9fa48("680") ? false : stryMutAct_9fa48("679") ? true : (stryCov_9fa48("679", "680", "681"), typeof yyyyqStr !== (stryMutAct_9fa48("682") ? "" : (stryCov_9fa48("682"), 'string')))) {
      if (stryMutAct_9fa48("683")) {
        {}
      } else {
        stryCov_9fa48("683");
        throw new Error(stryMutAct_9fa48("684") ? "" : (stryCov_9fa48("684"), "param should be a string"));
      }
    }

    if (stryMutAct_9fa48("687") ? yyyyqStr.length === 5 : stryMutAct_9fa48("686") ? false : stryMutAct_9fa48("685") ? true : (stryCov_9fa48("685", "686", "687"), yyyyqStr.length !== 5)) {
      if (stryMutAct_9fa48("688")) {
        {}
      } else {
        stryCov_9fa48("688");
        throw new Error(stryMutAct_9fa48("689") ? "" : (stryCov_9fa48("689"), "param should be five digits"));
      }
    }

    const qStr = yyyyqStr.substring(4, 5);

    if (stryMutAct_9fa48("692") ? false : stryMutAct_9fa48("691") ? true : stryMutAct_9fa48("690") ? qStr in qtrNumToQuarter : (stryCov_9fa48("690", "691", "692"), !(qStr in qtrNumToQuarter))) {
      if (stryMutAct_9fa48("693")) {
        {}
      } else {
        stryCov_9fa48("693");
        throw new Error(stryMutAct_9fa48("694") ? "" : (stryCov_9fa48("694"), "param should end in 1,2,3 or 4"));
      }
    }

    return parseInt(yyyyqStr);
  }
};

const nextQuarter = yyyyqInt => {
  if (stryMutAct_9fa48("695")) {
    {}
  } else {
    stryCov_9fa48("695");

    const _yyyyqStr = fromNumericYYYYQ(yyyyqInt); // just for type/format checking


    const qInt = stryMutAct_9fa48("696") ? yyyyqInt * 10 : (stryCov_9fa48("696"), yyyyqInt % 10);
    const yyyyInt = Math.floor(stryMutAct_9fa48("697") ? yyyyqInt * 10 : (stryCov_9fa48("697"), yyyyqInt / 10));

    if (stryMutAct_9fa48("701") ? qInt >= 4 : stryMutAct_9fa48("700") ? qInt <= 4 : stryMutAct_9fa48("699") ? false : stryMutAct_9fa48("698") ? true : (stryCov_9fa48("698", "699", "700", "701"), qInt < 4)) {
      if (stryMutAct_9fa48("702")) {
        {}
      } else {
        stryCov_9fa48("702");
        return stryMutAct_9fa48("703") ? yyyyqInt - 1 : (stryCov_9fa48("703"), yyyyqInt + 1);
      }
    }

    return stryMutAct_9fa48("704") ? (stryMutAct_9fa48("706") ? yyyyInt - 1 : (stryCov_9fa48("706"), yyyyInt + 1)) * 10 - 1 : (stryCov_9fa48("704"), (stryMutAct_9fa48("705") ? (yyyyInt + 1) / 10 : (stryCov_9fa48("705"), (stryMutAct_9fa48("706") ? yyyyInt - 1 : (stryCov_9fa48("706"), yyyyInt + 1)) * 10)) + 1);
  }
};

const quarterRange = (beginYYYYQStr, endYYYYQStr) => {
  if (stryMutAct_9fa48("707")) {
    {}
  } else {
    stryCov_9fa48("707");
    let quarterList = stryMutAct_9fa48("708") ? ["Stryker was here"] : (stryCov_9fa48("708"), []);
    const beginYYYYQInt = toNumericYYYYQ(beginYYYYQStr);
    const endYYYYQInt = toNumericYYYYQ(endYYYYQStr);

    for (let yyyyqInt = beginYYYYQInt; stryMutAct_9fa48("711") ? yyyyqInt > endYYYYQInt : stryMutAct_9fa48("710") ? yyyyqInt < endYYYYQInt : stryMutAct_9fa48("709") ? false : (stryCov_9fa48("709", "710", "711"), yyyyqInt <= endYYYYQInt); yyyyqInt = nextQuarter(yyyyqInt)) {
      if (stryMutAct_9fa48("712")) {
        {}
      } else {
        stryCov_9fa48("712");
        const yyyyqStr = fromNumericYYYYQ(yyyyqInt);
        quarterList.push(stryMutAct_9fa48("713") ? {} : (stryCov_9fa48("713"), {
          yyyyq: yyyyqStr,
          qyy: yyyyqToQyy(yyyyqStr)
        }));
      }
    }

    return quarterList;
  }
};

export { fromFormat, toFormat, yyyyqToQyy, fromNumericYYYYQ, toNumericYYYYQ, nextQuarter, quarterRange, qtrNumToQuarter };