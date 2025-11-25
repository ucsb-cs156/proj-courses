import React, { useState } from "react";
import { Table } from "react-bootstrap";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import OurPagination from "main/components/Utils/OurPagination";

function SectionsTableBase({ data, columns, testid = "testid" }) {
  const [expanded, setExpanded] = useState({});
  const [page, setPage] = useState(1); // Added state
  const pageSize = 10; // Added limit

  const altColor = "#e3ebfc";
  const whiteColor = "#ffffff";

  const table = useReactTable({
    data: data,
    columns: columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  // Pagination Logic
  const rows = table.getRowModel().rows;
  const totalPages = Math.ceil(rows.length / pageSize);
  const rowsToDisplay = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
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
          {/* CHANGED: Now using rowsToDisplay instead of all rows */}
          {rowsToDisplay.map((row) => {
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
      </Table>

      {/* ADDED: Pagination Control */}
      {totalPages > 0 && (
        <OurPagination
          activePage={page}
          changePage={setPage}
          totalPages={totalPages}
        />
      )}
    </>
  );
}

export default SectionsTableBase;
