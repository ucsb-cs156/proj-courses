import React from "react";
import { useTable, useGroupBy, useExpanded } from 'react-table'
import { Table } from "react-bootstrap";


// Stryker disable StringLiteral, ArrayDeclaration
export default function SectionsTableBase({ columns, data, testid = "testid"}) {
  
  // Stryker disable next-line ObjectLiteral
  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({initialState: {groupBy: ["courseInfo.courseId"], hiddenColumns: ["isSection"]}, columns, data }, useGroupBy, useExpanded)

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
            <>
            {row.cells[0].isGrouped || (!row.cells[0].isGrouped && row.allCells[3].value) ? 
            <tr {...row.getRowProps()}>
              {row.cells.map((cell, _index) => {
                return (
                    <td
                    {...cell.getCellProps()}
                    data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`}
                    // Stryker disable next-line ObjectLiteral
                    style={{background: cell.isGrouped ? "#e5fcf4" : cell.isAggregated ? "#e5fcf4" : "#effcf8", fontWeight: cell.isGrouped ? "bold" : cell.isAggregated ? "bold" : "normal"}}
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
                    <>
                    
                    </>
                  </td>
                )
              })}

            </tr>
            : null}
            </>
          )
        })}
      </tbody>
    </Table>
  )
}