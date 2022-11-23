// @ts-nocheck
// compareValues comes from this article
//   https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
// It is used to sort arrays of objects, like this:
// For
//  const singers = [
//     { name: 'Steven Tyler', band: 'Aerosmith', born: 1948 },
//     { name: 'Karen Carpenter', band: 'The Carpenters', born: 1950 },
//     { name: 'Kurt Cobain', band: 'Nirvana', born: 1967 },
//     { name: 'Stevie Nicks', band: 'Fleetwood Mac', born: 1948 },
//   ];
//
// Use: 
// // array is sorted by band, in ascending order by default
// singers.sort(compareValues('band'));
// // array is sorted by band in descending order
// singers.sort(compareValues('band', 'desc'));
// // array is sorted by name in ascending order
// singers.sort(compareValues('name'));
// // array is sorted by date if birth in descending order
// singers.sort(compareValues('born', 'desc'));
// Stryker disable next-line StringLiteral: The "" mutant results in equivalent mutant due to it defaulting to ascending sort if order is not "desc"
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

export function compareValues(key, order = 'asc') {
  if (stryMutAct_9fa48("792")) {
    {}
  } else {
    stryCov_9fa48("792");
    return function innerSort(a, b) {
      if (stryMutAct_9fa48("793")) {
        {}
      } else {
        stryCov_9fa48("793");

        // Logical Operator: Requiring only one object to have the property causes comparisons to undefined to be equivalent (> or < to undefined evaluates to false which will return 0)
        // Conditional Expression: Changing to false could have both properties be undefined but < > comparisons to undefeind are equivalent to false, returning 0 anyway
        // BlockStatement: Removing "Return 0" reults in equivalent mutant since one or both elements will be undefined and < > comparisons will evaluate to false
        // Stryker disable next-line LogicalOperator, ConditionalExpression, BlockStatement: Each mutant results in equivalent code (reasons in above code comment)
        if ((stryMutAct_9fa48("797") ? a.hasOwnProperty(key) : (stryCov_9fa48("797"), !a.hasOwnProperty(key))) || (stryMutAct_9fa48("798") ? b.hasOwnProperty(key) : (stryCov_9fa48("798"), !b.hasOwnProperty(key)))) {
          // property doesn't exist on either object
          return 0;
        }

        const varA = (stryMutAct_9fa48("802") ? typeof a[key] !== 'string' : stryMutAct_9fa48("801") ? false : stryMutAct_9fa48("800") ? true : (stryCov_9fa48("800", "801", "802"), typeof a[key] === (stryMutAct_9fa48("803") ? "" : (stryCov_9fa48("803"), 'string')))) ? a[key].toUpperCase() : a[key];
        const varB = (stryMutAct_9fa48("806") ? typeof b[key] !== 'string' : stryMutAct_9fa48("805") ? false : stryMutAct_9fa48("804") ? true : (stryCov_9fa48("804", "805", "806"), typeof b[key] === (stryMutAct_9fa48("807") ? "" : (stryCov_9fa48("807"), 'string')))) ? b[key].toUpperCase() : b[key];
        let comparison = 0; // Stryker disable next-line EqualityOperator: the >= mutant results in an equivalent mutant (if two elems are equal switching them is the same)

        if (stryMutAct_9fa48("809") ? false : stryMutAct_9fa48("808") ? true : (stryCov_9fa48("808", "809"), varA > varB)) {
          if (stryMutAct_9fa48("812")) {
            {}
          } else {
            stryCov_9fa48("812");
            comparison = 1;
          }
        } else if (stryMutAct_9fa48("816") ? varA >= varB : stryMutAct_9fa48("815") ? varA <= varB : stryMutAct_9fa48("814") ? false : stryMutAct_9fa48("813") ? true : (stryCov_9fa48("813", "814", "815", "816"), varA < varB)) {
          if (stryMutAct_9fa48("817")) {
            {}
          } else {
            stryCov_9fa48("817");
            comparison = stryMutAct_9fa48("818") ? +1 : (stryCov_9fa48("818"), -1);
          }
        }

        return (// Stryker disable next-line ArithmeticOperator: The / mutant results in an equivalent mutant
          (stryMutAct_9fa48("821") ? order !== 'desc' : stryMutAct_9fa48("820") ? false : stryMutAct_9fa48("819") ? true : (stryCov_9fa48("819", "820", "821"), order === (stryMutAct_9fa48("822") ? "" : (stryCov_9fa48("822"), 'desc')))) ? comparison * (stryMutAct_9fa48("824") ? +1 : (stryCov_9fa48("824"), -1)) : comparison
        );
      }
    };
  }
}