import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper, // Optional, but good practice for defining columns
  getSortedRowModel,
} from "@tanstack/react-table";
import { Button } from "react-bootstrap";
import SortCaret from "main/components/Common/SortCaret";
// import Plaintext from "main/components/Utils/Plaintext";

export function convertOldStyleColumnsToNewStyle(oldStyleColumns) {
  const result = [];
  for (const col of oldStyleColumns) {
    const newCol = {
      id: col.accessor || col.accessorKey, // Use accessor or accessorKey as id
      header: col.Header || col.header, // Use Header or header for the column title
      accessorKey: col.accessor || col.accessorKey, // Use accessor or accessorKey
      ...col,
    };
    if (newCol.accessorKey instanceof Function) {
      newCol.cell = col.accessor;
      newCol.accessorKey = col.header;
    }
    result.push({ ...newCol });
  }
  return result;
}

function OurTable({ data, columns, testid = "testid" }) {
  const newColumns = convertOldStyleColumnsToNewStyle(columns);
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => newColumns, [newColumns]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table className="table table-striped table-bordered" data-testid={testid}>
      <thead>
        {table.getHeaderGroups().map((headerGroup, i) => (
          <tr
            data-testid={`${testid}-header-group-${i}`}
            // Stryker disable next-line StringLiteral : React key property not exposed in dom
            key={`${testid}-header-group-${i}`}
          >
            {headerGroup.headers.map((header) => (
              <th
                data-testid={`${testid}-header-${header.column.id}`}
                key={`${testid}-header-${header.column.id}`}
                colSpan={header.colSpan}
              >
                {header.isPlaceholder ? null : (
                  <div
                    // Add onClick handler for sorting if the column is sortable
                    {...(header.column.getCanSort() && {
                      onClick: header.column.getToggleSortingHandler(),
                      style: { cursor: "pointer" }, // Add cursor style for visual cue
                    })}
                    data-testid={`${testid}-header-${header.column.id}-sort-header`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    <SortCaret header={header} testId={testid} />
                  </div>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          const rowTestId = `${testid}-row-${row.index}`;
          return (
            <tr
              data-testid={rowTestId}
              // Stryker disable next-line StringLiteral : React key property not exposed in dom
              key={rowTestId}
            >
              {row.getVisibleCells().map((cell) => {
                const testId = `${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`;
                return (
                  <td
                    data-testid={testId}
                    // Stryker disable next-line StringLiteral : React key property not exposed in dom
                    key={testId}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default OurTable;

export function ButtonColumn(label, variant, callback, testid) {
  const columnHelper = createColumnHelper();

  const buttonColumn = columnHelper.display({
    id: label, // Unique ID for display columns
    header: label,
    cell: ({ cell }) => (
      <Button
        variant={variant}
        onClick={() => callback(cell)}
        data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-button`}
      >
        {label}
      </Button>
    ),
  });
  return buttonColumn;
}

// export function PlaintextColumn(label, getText) {
//   const columnHelper = createColumnHelper();
//   const column = columnHelper.display({
//     id: label,
//     header: label,
//     cell: ({ cell }) => <Plaintext text={getText(cell)} />,
//   });
//   return column;
// }

export function DateColumn(label, getDate) {
  const columnHelper = createColumnHelper();
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: "America/Los_Angeles",
  };
  const column = columnHelper.display({
    header: label,
    id: label,
    cell: ({ cell }) => {
      const date = new Date(getDate(cell));
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date,
      );
      return <>{formattedDate}</>;
    },
  });

  return column;
}
