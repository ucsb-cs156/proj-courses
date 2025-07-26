// import React, { Fragment } from "react";
// import { useTable, useGroupBy, useExpanded } from "react-table";
import { Table } from "react-bootstrap";
// import { removeKey } from "main/utils/removeKey";

import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getGroupedRowModel,
  getExpandedRowModel
} from "@tanstack/react-table";
import SortCaret from "main/components/Common/SortCaret";
import { convertOldStyleColumnsToNewStyle } from "./OurTable";

export default function SectionsTableBase({
  columns,
  data,
  testid = "testid",
}) {

  const newColumns = convertOldStyleColumnsToNewStyle(columns);
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => newColumns, [newColumns]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <Table bordered hover className="table-hover" data-testid={testid}>
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
        {table.getRowModel().rows.map((row, i) => {
          const rowStyle = {
            background: i % 2 === 0 ? "#e3ebfc" : "#ffffff",
          };
          const rowTestId = `${testid}-row-${row.index}`;
          return (
            <tr
              data-testid={rowTestId}
              // Stryker disable next-line StringLiteral : React key property not exposed in dom
              key={rowTestId}
              style={rowStyle}
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
    </Table>
  );

}

// // Stryker disable next-line ObjectLiteral
// const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//   useTable(
//     {
//       initialState: {
//         groupBy: ["courseInfo.courseId"],
//         hiddenColumns: ["isSection"],
//       },
//       columns,
//       data,
//     },
//     useGroupBy,
//     useExpanded,
//   );
// return (
//   <Table {...getTableProps()} bordered hover className="table-hover">
//     <thead key="thead">
//       {headerGroups.map((headerGroup, i) => (
//         <tr key={`tr-${i}`} {...removeKey(headerGroup.getHeaderGroupProps())}>
//           {headerGroup.headers.map((column) => (
//             <th
//               key={`${column.id}`}
//               {...removeKey(column.getHeaderProps())}
//               data-testid={`${testid}-header-${column.id}`}
//             >
//               {column.render("Header")}
//             </th>
//           ))}
//         </tr>
//       ))}
//     </thead>
//     <tbody {...getTableBodyProps()} key="tbody">
//       {rows.map((row, i) => {
//         prepareRow(row);
//         const rowStyle = {
//           background: i % 2 === 0 ? "#e3ebfc" : "#ffffff",
//         };
//         return (
//           <Fragment key={`row-${i}`}>
//             {row.cells[0].isGrouped ||
//             (!row.cells[0].isGrouped && row.allCells[3].value) ? (
//               <tr style={rowStyle} key={`row-${i}`}>
//                 {row.cells.map((cell, _index) => {
//                   return (
//                     <td
//                       key={`${cell.column.id}`}
//                       {...removeKey(cell.getCellProps())}
//                       data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`}
//                       // Stryker disable next-line ObjectLiteral
//                       style={{
//                         background: cell.isGrouped
//                           ? "inherit"
//                           : cell.isAggregated
//                             ? "inherit"
//                             : null,
//                         color: cell.isGrouped
//                           ? "#4a4f4f"
//                           : cell.isAggregated
//                             ? "#4a4f4f"
//                             : "#4a4f4f",
//                         fontWeight: cell.isGrouped
//                           ? "bold"
//                           : cell.isAggregated
//                             ? "bold"
//                             : "normal",
//                       }}
//                     >
//                       {cell.isGrouped ? (
//                         <>
//                           <span
//                             {...row.getToggleRowExpandedProps()}
//                             data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-expand-symbols`}
//                           >
//                             {row.subRows.length > 1
//                               ? row.isExpanded
//                                 ? "➖ "
//                                 : "➕ "
//                               : null}
//                           </span>{" "}
//                           {cell.render("Cell")}
//                         </>
//                       ) : cell.isAggregated ? (
//                         cell.render("Aggregated")
//                       ) : (
//                         cell.render("Cell")
//                       )}
//                       <></>
//                     </td>
//                   );
//                 })}
//               </tr>
//             ) : null}
//           </Fragment>
//         );
//       })}
//     </tbody>
//   </Table>
// );

