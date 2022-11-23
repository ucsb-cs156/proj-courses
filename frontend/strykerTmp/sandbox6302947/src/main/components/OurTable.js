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

import React from "react";
import { useTable, useSortBy } from 'react-table';
import { Table, Button } from "react-bootstrap";
export default function OurTable({
  columns,
  data,
  testid = stryMutAct_9fa48("167") ? "" : (stryCov_9fa48("167"), "testid")
}) {
  if (stryMutAct_9fa48("168")) {
    {}
  } else {
    stryCov_9fa48("168");
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow
    } = useTable(stryMutAct_9fa48("169") ? {} : (stryCov_9fa48("169"), {
      columns,
      data
    }), useSortBy);
    return <Table {...getTableProps()} striped bordered hover>
      <thead>
        {headerGroups.map(stryMutAct_9fa48("170") ? () => undefined : (stryCov_9fa48("170"), headerGroup => <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(stryMutAct_9fa48("171") ? () => undefined : (stryCov_9fa48("171"), column => <th {...column.getHeaderProps(column.getSortByToggleProps())} data-testid={stryMutAct_9fa48("172") ? `` : (stryCov_9fa48("172"), `${testid}-header-${column.id}`)}>
                {column.render(stryMutAct_9fa48("173") ? "" : (stryCov_9fa48("173"), 'Header'))}
                <span data-testid={stryMutAct_9fa48("174") ? `` : (stryCov_9fa48("174"), `${testid}-header-${column.id}-sort-carets`)}>
                  {column.isSorted ? column.isSortedDesc ? stryMutAct_9fa48("175") ? "" : (stryCov_9fa48("175"), ' 🔽') : stryMutAct_9fa48("176") ? "" : (stryCov_9fa48("176"), ' 🔼') : stryMutAct_9fa48("177") ? "Stryker was here!" : (stryCov_9fa48("177"), '')}
                </span>
              </th>))}
          </tr>))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          if (stryMutAct_9fa48("178")) {
            {}
          } else {
            stryCov_9fa48("178");
            prepareRow(row);
            return <tr {...row.getRowProps()}>
              {row.cells.map((cell, _index) => {
                if (stryMutAct_9fa48("179")) {
                  {}
                } else {
                  stryCov_9fa48("179");
                  return <td {...cell.getCellProps()} data-testid={stryMutAct_9fa48("180") ? `` : (stryCov_9fa48("180"), `${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`)}>
                    {cell.render(stryMutAct_9fa48("181") ? "" : (stryCov_9fa48("181"), 'Cell'))}
                  </td>;
                }
              })}
            </tr>;
          }
        })}
      </tbody>
    </Table>;
  }
} // The callback function for ButtonColumn should have the form
// (cell) => { doSomethingWith(cell); }
// The fields in cell are:
//   ["column","row","value","getCellProps","render"]
// Documented here: https://react-table.tanstack.com/docs/api/useTable#cell-properties
// Typically, you want cell.row.values, which is where you can get the individual
//   fields of the object representing the row in the table.
// Example: 
//   const deleteCallback = (cell) => 
//      toast(`Delete Callback called on id: ${cell.row.values.id} name: ${cell.row.values.name}`);
// Add it to table like this:
// const columns = [
//   {
//       Header: 'id',
//       accessor: 'id', // accessor is the "key" in the data
//   },
//   {
//       Header: 'Name',
//       accessor: 'name',
//   },
//   ButtonColumn("Edit", "primary", editCallback),
//   ButtonColumn("Delete", "danger", deleteCallback)
// ];

export function ButtonColumn(label, variant, callback, testid) {
  if (stryMutAct_9fa48("182")) {
    {}
  } else {
    stryCov_9fa48("182");
    const column = stryMutAct_9fa48("183") ? {} : (stryCov_9fa48("183"), {
      Header: label,
      id: label,
      Cell: stryMutAct_9fa48("184") ? () => undefined : (stryCov_9fa48("184"), ({
        cell
      }) => <Button variant={variant} onClick={stryMutAct_9fa48("185") ? () => undefined : (stryCov_9fa48("185"), () => callback(cell))} data-testid={stryMutAct_9fa48("186") ? `` : (stryCov_9fa48("186"), `${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-button`)}>
        {label}
      </Button>)
    });
    return column;
  }
}