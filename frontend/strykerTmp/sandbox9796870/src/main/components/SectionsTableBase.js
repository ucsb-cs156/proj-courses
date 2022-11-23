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
import { useTable, useGroupBy, useExpanded } from 'react-table';
import { Table } from "react-bootstrap"; // Stryker disable StringLiteral, ArrayDeclaration

export default function SectionsTableBase({
  columns,
  data,
  testid = "testid"
}) {
  if (stryMutAct_9fa48("267")) {
    {}
  } else {
    stryCov_9fa48("267");
    // Stryker disable next-line ObjectLiteral
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow
    } = useTable({
      initialState: {
        groupBy: ["courseInfo.courseId"],
        hiddenColumns: ["isSection"]
      },
      columns,
      data
    }, useGroupBy, useExpanded);
    return <Table {...getTableProps()} striped bordered hover>
      <thead>
        {headerGroups.map(stryMutAct_9fa48("274") ? () => undefined : (stryCov_9fa48("274"), headerGroup => <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(stryMutAct_9fa48("275") ? () => undefined : (stryCov_9fa48("275"), column => <th {...column.getHeaderProps()} data-testid={`${testid}-header-${column.id}`}>
                {column.render('Header')}
              </th>))}
          </tr>))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          if (stryMutAct_9fa48("278")) {
            {}
          } else {
            stryCov_9fa48("278");
            prepareRow(row);
            return <>
            {(stryMutAct_9fa48("281") ? row.cells[0].isGrouped && !row.cells[0].isGrouped && row.allCells[3].value : stryMutAct_9fa48("280") ? false : stryMutAct_9fa48("279") ? true : (stryCov_9fa48("279", "280", "281"), row.cells[0].isGrouped || (stryMutAct_9fa48("283") ? !row.cells[0].isGrouped || row.allCells[3].value : stryMutAct_9fa48("282") ? false : (stryCov_9fa48("282", "283"), (stryMutAct_9fa48("284") ? row.cells[0].isGrouped : (stryCov_9fa48("284"), !row.cells[0].isGrouped)) && row.allCells[3].value)))) ? <tr {...row.getRowProps()}>
              {row.cells.map((cell, _index) => {
                  if (stryMutAct_9fa48("285")) {
                    {}
                  } else {
                    stryCov_9fa48("285");
                    return <td {...cell.getCellProps()} data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`} // Stryker disable next-line ObjectLiteral
                    style={{
                      background: cell.isGrouped ? "#e5fcf4" : cell.isAggregated ? "#e5fcf4" : "#effcf8",
                      fontWeight: cell.isGrouped ? "bold" : cell.isAggregated ? "bold" : "normal"
                    }}>
                    
                    {cell.isGrouped ? <>
                    <span {...row.getToggleRowExpandedProps()} data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-expand-symbols`}>
                    {row.isExpanded ? "➖ " : "➕ "}
                    </span>{" "}
                    {cell.render("Cell")} 
                    </> : cell.isAggregated ? cell.render("Aggregated") : cell.render('Cell')}
                    <>
                    
                    </>
                  </td>;
                  }
                })}

            </tr> : null}
            </>;
          }
        })}
      </tbody>
    </Table>;
  }
}