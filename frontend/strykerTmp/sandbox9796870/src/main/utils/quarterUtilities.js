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

const quarters = stryMutAct_9fa48("619") ? [] : (stryCov_9fa48("619"), [stryMutAct_9fa48("620") ? "" : (stryCov_9fa48("620"), "WINTER"), stryMutAct_9fa48("621") ? "" : (stryCov_9fa48("621"), "SPRING"), stryMutAct_9fa48("622") ? "" : (stryCov_9fa48("622"), "SUMMER"), stryMutAct_9fa48("623") ? "" : (stryCov_9fa48("623"), "FALL")]);
const shortQuarters = stryMutAct_9fa48("624") ? [] : (stryCov_9fa48("624"), [stryMutAct_9fa48("625") ? "" : (stryCov_9fa48("625"), "W"), stryMutAct_9fa48("626") ? "" : (stryCov_9fa48("626"), "S"), stryMutAct_9fa48("627") ? "" : (stryCov_9fa48("627"), "M"), stryMutAct_9fa48("628") ? "" : (stryCov_9fa48("628"), "F")]);
const qtrNumToQuarter = stryMutAct_9fa48("629") ? {} : (stryCov_9fa48("629"), {
  '1': stryMutAct_9fa48("630") ? "" : (stryCov_9fa48("630"), 'WINTER'),
  '2': stryMutAct_9fa48("631") ? "" : (stryCov_9fa48("631"), 'SPRING'),
  '3': stryMutAct_9fa48("632") ? "" : (stryCov_9fa48("632"), 'SUMMER'),
  '4': stryMutAct_9fa48("633") ? "" : (stryCov_9fa48("633"), 'FALL')
});

const yyyyqToQyy = yyyyq => {
  if (stryMutAct_9fa48("634")) {
    {}
  } else {
    stryCov_9fa48("634");
    return stryMutAct_9fa48("635") ? `` : (stryCov_9fa48("635"), `${shortQuarters[stryMutAct_9fa48("636") ? parseInt(yyyyq.charAt(4)) + 1 : (stryCov_9fa48("636"), parseInt(yyyyq.charAt(4)) - 1)]}${yyyyq.substring(2, 4)}`);
  }
};

const toFormat = (quarter, year) => {
  if (stryMutAct_9fa48("637")) {
    {}
  } else {
    stryCov_9fa48("637");
    return stryMutAct_9fa48("638") ? year.toString() - parseInt(quarter).toString() : (stryCov_9fa48("638"), year.toString() + parseInt(quarter).toString());
  }
};

const fromFormat = format => {
  if (stryMutAct_9fa48("639")) {
    {}
  } else {
    stryCov_9fa48("639");
    return stryMutAct_9fa48("640") ? `` : (stryCov_9fa48("640"), `${quarters[stryMutAct_9fa48("641") ? parseInt(format.charAt(4)) + 1 : (stryCov_9fa48("641"), parseInt(format.charAt(4)) - 1)]} ${format.substring(0, 4)}`);
  }
};

const fromNumericYYYYQ = yyyyqInt => {
  if (stryMutAct_9fa48("642")) {
    {}
  } else {
    stryCov_9fa48("642");

    if (stryMutAct_9fa48("645") ? typeof yyyyqInt == 'number' : stryMutAct_9fa48("644") ? false : stryMutAct_9fa48("643") ? true : (stryCov_9fa48("643", "644", "645"), typeof yyyyqInt != (stryMutAct_9fa48("646") ? "" : (stryCov_9fa48("646"), 'number')))) {
      if (stryMutAct_9fa48("647")) {
        {}
      } else {
        stryCov_9fa48("647");
        throw new Error(stryMutAct_9fa48("648") ? "" : (stryCov_9fa48("648"), "param should be a number"));
      }
    }

    const yyyyqStr = yyyyqInt.toString();

    if (stryMutAct_9fa48("651") ? yyyyqStr.length === 5 : stryMutAct_9fa48("650") ? false : stryMutAct_9fa48("649") ? true : (stryCov_9fa48("649", "650", "651"), yyyyqStr.length !== 5)) {
      if (stryMutAct_9fa48("652")) {
        {}
      } else {
        stryCov_9fa48("652");
        throw new Error(stryMutAct_9fa48("653") ? "" : (stryCov_9fa48("653"), "param should be five digits"));
      }
    }

    const qStr = yyyyqStr.substring(4, 5);

    if (stryMutAct_9fa48("656") ? false : stryMutAct_9fa48("655") ? true : stryMutAct_9fa48("654") ? qStr in qtrNumToQuarter : (stryCov_9fa48("654", "655", "656"), !(qStr in qtrNumToQuarter))) {
      if (stryMutAct_9fa48("657")) {
        {}
      } else {
        stryCov_9fa48("657");
        throw new Error(stryMutAct_9fa48("658") ? "" : (stryCov_9fa48("658"), "param should end in 1,2,3 or 4"));
      }
    }

    return yyyyqStr;
  }
};

const toNumericYYYYQ = yyyyqStr => {
  if (stryMutAct_9fa48("659")) {
    {}
  } else {
    stryCov_9fa48("659");

    if (stryMutAct_9fa48("662") ? typeof yyyyqStr === 'string' : stryMutAct_9fa48("661") ? false : stryMutAct_9fa48("660") ? true : (stryCov_9fa48("660", "661", "662"), typeof yyyyqStr !== (stryMutAct_9fa48("663") ? "" : (stryCov_9fa48("663"), 'string')))) {
      if (stryMutAct_9fa48("664")) {
        {}
      } else {
        stryCov_9fa48("664");
        throw new Error(stryMutAct_9fa48("665") ? "" : (stryCov_9fa48("665"), "param should be a string"));
      }
    }

    if (stryMutAct_9fa48("668") ? yyyyqStr.length === 5 : stryMutAct_9fa48("667") ? false : stryMutAct_9fa48("666") ? true : (stryCov_9fa48("666", "667", "668"), yyyyqStr.length !== 5)) {
      if (stryMutAct_9fa48("669")) {
        {}
      } else {
        stryCov_9fa48("669");
        throw new Error(stryMutAct_9fa48("670") ? "" : (stryCov_9fa48("670"), "param should be five digits"));
      }
    }

    const qStr = yyyyqStr.substring(4, 5);

    if (stryMutAct_9fa48("673") ? false : stryMutAct_9fa48("672") ? true : stryMutAct_9fa48("671") ? qStr in qtrNumToQuarter : (stryCov_9fa48("671", "672", "673"), !(qStr in qtrNumToQuarter))) {
      if (stryMutAct_9fa48("674")) {
        {}
      } else {
        stryCov_9fa48("674");
        throw new Error(stryMutAct_9fa48("675") ? "" : (stryCov_9fa48("675"), "param should end in 1,2,3 or 4"));
      }
    }

    return parseInt(yyyyqStr);
  }
};

const nextQuarter = yyyyqInt => {
  if (stryMutAct_9fa48("676")) {
    {}
  } else {
    stryCov_9fa48("676");

    const _yyyyqStr = fromNumericYYYYQ(yyyyqInt); // just for type/format checking


    const qInt = stryMutAct_9fa48("677") ? yyyyqInt * 10 : (stryCov_9fa48("677"), yyyyqInt % 10);
    const yyyyInt = Math.floor(stryMutAct_9fa48("678") ? yyyyqInt * 10 : (stryCov_9fa48("678"), yyyyqInt / 10));

    if (stryMutAct_9fa48("682") ? qInt >= 4 : stryMutAct_9fa48("681") ? qInt <= 4 : stryMutAct_9fa48("680") ? false : stryMutAct_9fa48("679") ? true : (stryCov_9fa48("679", "680", "681", "682"), qInt < 4)) {
      if (stryMutAct_9fa48("683")) {
        {}
      } else {
        stryCov_9fa48("683");
        return stryMutAct_9fa48("684") ? yyyyqInt - 1 : (stryCov_9fa48("684"), yyyyqInt + 1);
      }
    }

    return stryMutAct_9fa48("685") ? (stryMutAct_9fa48("687") ? yyyyInt - 1 : (stryCov_9fa48("687"), yyyyInt + 1)) * 10 - 1 : (stryCov_9fa48("685"), (stryMutAct_9fa48("686") ? (yyyyInt + 1) / 10 : (stryCov_9fa48("686"), (stryMutAct_9fa48("687") ? yyyyInt - 1 : (stryCov_9fa48("687"), yyyyInt + 1)) * 10)) + 1);
  }
};

const quarterRange = (beginYYYYQStr, endYYYYQStr) => {
  if (stryMutAct_9fa48("688")) {
    {}
  } else {
    stryCov_9fa48("688");
    let quarterList = stryMutAct_9fa48("689") ? ["Stryker was here"] : (stryCov_9fa48("689"), []);
    const beginYYYYQInt = toNumericYYYYQ(beginYYYYQStr);
    const endYYYYQInt = toNumericYYYYQ(endYYYYQStr);

    for (let yyyyqInt = beginYYYYQInt; stryMutAct_9fa48("692") ? yyyyqInt > endYYYYQInt : stryMutAct_9fa48("691") ? yyyyqInt < endYYYYQInt : stryMutAct_9fa48("690") ? false : (stryCov_9fa48("690", "691", "692"), yyyyqInt <= endYYYYQInt); yyyyqInt = nextQuarter(yyyyqInt)) {
      if (stryMutAct_9fa48("693")) {
        {}
      } else {
        stryCov_9fa48("693");
        const yyyyqStr = fromNumericYYYYQ(yyyyqInt);
        quarterList.push(stryMutAct_9fa48("694") ? {} : (stryCov_9fa48("694"), {
          yyyyq: yyyyqStr,
          qyy: yyyyqToQyy(yyyyqStr)
        }));
      }
    }

    return quarterList;
  }
};

export { fromFormat, toFormat, yyyyqToQyy, fromNumericYYYYQ, toNumericYYYYQ, nextQuarter, quarterRange, qtrNumToQuarter };