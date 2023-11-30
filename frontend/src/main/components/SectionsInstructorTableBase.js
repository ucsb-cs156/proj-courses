import React from "react";
import { useTable, useGroupBy, useExpanded } from "react-table";
import { Table } from "react-bootstrap";
import { isSection } from "main/utils/sectionUtils.js";

// Stryker disable StringLiteral, ArrayDeclaration
export default function SectionsInstructorTableBase({
  columns,
  data,
  testid = "testid",
}) {
  // Stryker disable next-line ObjectLiteral
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useGroupBy,
      useExpanded,
    );

  return (
    <Table {...getTableProps()} striped bordered hover>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                data-testid={`${testid}-header-${column.id}`}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <>
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, _index) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`}
                      // Stryker disable next-line ObjectLiteral
                      style={{
                        background: isSection(
                          data[cell.row.index].section.section,
                        )
                          ? "#9dbfbe"
                          : "#34859b",
                        color: isSection(data[cell.row.index].section.section)
                          ? "#000000"
                          : "#effcf4",
                        fontWeight: isSection(
                          data[cell.row.index].section.section,
                        )
                          ? "normal"
                          : "bold",
                      }}
                    >
                      {cell.render("Cell")}
                      <></>
                    </td>
                  );
                })}
              </tr>
            </>
          );
        })}
      </tbody>
    </Table>
  );
}
