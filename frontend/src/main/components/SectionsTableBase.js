import React, { useState } from "react";
import { Table } from "react-bootstrap";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";

function SectionsTableBase({ data, columns, testid = "testid" }) {
  const [expanded, setExpanded] = useState({});

  const altColor = "#e3ebfc";
  const whiteColor = "#ffffff";

  const table = useReactTable({
    data: data,
    columns: columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows, // This tells TanStack Table how to find sub-rows
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(), // Required for expansion
  });

  return (
    <Table data-testid={testid} bordered hover className="table-hover">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          const rowStyle = {
            backgroundColor: row.index % 2 === 0 ? altColor : whiteColor,
          };
          const rowId = `row-${row.id}`;
          return (
            <tr
              key={rowId}
              style={rowStyle}
              data-testid={`${testid}-${rowId}`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  data-testid={`${testid}-cell-row-${cell.row.id}-col-${cell.column.id}`}
                  style={{
                    backgroundColor: "inherit",
                    fontWeight: row.depth === 0 ? "bold" : "normal",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </Table>
  );
}

export default SectionsTableBase;
