import React, { Fragment } from "react";
import { useTable, useGroupBy, useExpanded } from "react-table";
import { Table } from "react-bootstrap";

// Stryker disable StringLiteral, ArrayDeclaration
export default function SectionsTableBase({
  columns,
  data,
  testid = "testid",
}) {
  // Stryker disable next-line ObjectLiteral
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        initialState: {
          groupBy: ["courseInfo.courseId"],
          hiddenColumns: ["isSection"],
        },
        columns,
        data,
      },
      useGroupBy,
      useExpanded,
    );

  return (
    <Table {...getTableProps()} striped bordered hover>
      <thead key="thead">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                data-testid={`${testid}-header-${column.id}`}
                // Stryker disable next-line ObjectLiteral
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} key="tbody">
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <Fragment key={`row-${i}`}>
              {row.cells[0].isGrouped ||
              (!row.cells[0].isGrouped && row.allCells[3].value) ? (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, _index) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`}
                        // Stryker disable next-line ObjectLiteral
                        style={{
                          background: cell.isGrouped
                            ? "#003262" // UC Blue background for grouped cells
                            : cell.isAggregated
                            ? "#003262" // UC Blue background for aggregated cells
                            : "#FDB515", // UC Gold background for regular cells
                          color: cell.isGrouped
                            ? "#FDB515" // UC Gold text for grouped cells
                            : cell.isAggregated
                            ? "#FDB515" // UC Gold text for aggregated cells
                            : "#003262", // UC Blue text for regular cells
                          fontWeight:
                            cell.isGrouped || cell.isAggregated
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {cell.isGrouped ? (
                          <>
                            <span
                              {...row.getToggleRowExpandedProps()}
                              data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-expand-symbols`}
                            >
                              {row.subRows.length > 1
                                ? row.isExpanded
                                  ? "➖ "
                                  : "➕ "
                                : null}
                            </span>{" "}
                            {cell.render("Cell")}
                          </>
                        ) : cell.isAggregated ? (
                          cell.render("Aggregated")
                        ) : (
                          cell.render("Cell")
                        )}
                        <></>
                      </td>
                    );
                  })}
                </tr>
              ) : null}
            </Fragment>
          );
        })}
      </tbody>
    </Table>
  );
}
