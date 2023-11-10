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
export function compareValues(key, order = "asc") {
  return function innerSort(a, b) {
    // Logical Operator: Requiring only one object to have the property causes comparisons to undefined to be equivalent (> or < to undefined evaluates to false which will return 0)
    // Conditional Expression: Changing to false could have both properties be undefined but < > comparisons to undefeind are equivalent to false, returning 0 anyway
    // BlockStatement: Removing "Return 0" reults in equivalent mutant since one or both elements will be undefined and < > comparisons will evaluate to false
    // Stryker disable next-line LogicalOperator, ConditionalExpression, BlockStatement: Each mutant results in equivalent code (reasons in above code comment)
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    // Stryker disable next-line EqualityOperator: the >= mutant results in an equivalent mutant (if two elems are equal switching them is the same)
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      // Stryker disable next-line ArithmeticOperator: The / mutant results in an equivalent mutant
      order === "desc" ? comparison * -1 : comparison
    );
  };
}
