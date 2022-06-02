import React from "react";
import { useTable, _useSortBy, useGroupBy, useExpanded } from 'react-table'
import { Table, _Button } from "react-bootstrap";


// Stryker disable StringLiteral, ArrayDeclaration
export default function SectionsTableBase({ columns, data, testid = "testid"}) {
  
  // Stryker disable next-line ObjectLiteral
  const {getTableProps, getTableBodyProps, headerGroups, rows,prepareRow} = useTable({initialState: {groupBy: []}, columns, data }, useGroupBy, useExpanded)

  return (
    <Table {...getTableProps()} striped bordered hover >
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                data-testid={`${testid}-header-${column.id}`}
              >
                {column.canGroupBy ? (
                    <span data-testid={`${testid}-header-${column.id}-expand-boxes`}
                    {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? "🟥 " : "🟩 "}
                    </span>
                ) : null}
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell, _index) => {
                return (
                    <td
                    {...cell.getCellProps()}
                    data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`}
                    // Stryker disable next-line ObjectLiteral
                    style={{background: cell.isGrouped ? "#e5fcf4" : cell.isAggregated ? "#e5fcf4" : "#effcf8"}}
                  >
                    
                    {cell.isGrouped ? (
                    <>
                    <span {...row.getToggleRowExpandedProps()}
                    data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-expand-symbols`}
                    >
                        {row.isExpanded ? "➖ " : "➕ "}
                    </span>{" "}
                    {cell.render("Cell")} 
                    </>
                    ) 
                    : cell.isAggregated ? (
                      cell.render("Aggregated")
                    )
                    : cell.render('Cell')
                  }
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}