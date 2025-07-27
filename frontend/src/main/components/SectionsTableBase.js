import React, { useState } from 'react';
import { Table } from "react-bootstrap"
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';

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
                    header.getContext()
                  )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          const rowStyle = { backgroundColor: row.index % 2 === 0 ? altColor : whiteColor};
          return (
            <tr 
            key={`rowId-${row.id}`} 
            style={rowStyle} 
            data-testid={`${testid}-row-${row.index}`}
            >
              {row.getVisibleCells().map((cell) => (
                <td 
                  key={cell.id}
                  data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`}
                  style={{
                    backgroundColor: "inherit",
                    fontWeight: row.depth === 0
                      ? "bold"
                      : "normal",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          )
        }
        )}
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
                    header.getContext()
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


// import React, { Fragment } from "react";
// import { useTable, useGroupBy, useExpanded } from "react-table";
// import { Table } from "react-bootstrap";
// import { removeKey } from "main/utils/removeKey";

// // Stryker disable StringLiteral, ArrayDeclaration
// export default function SectionsTableBase({
//   columns,
//   data,
//   testid = "testid",
// }) {
//   // Stryker disable next-line ObjectLiteral
//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable(
//       {
//         initialState: {
//           groupBy: ["courseInfo.courseId"],
//           hiddenColumns: ["isSection"],
//         },
//         columns,
//         data,
//       },
//       useGroupBy,
//       useExpanded,
//     );

//   return (
//     <Table {...getTableProps()} bordered hover className="table-hover">
//       <thead key="thead">
//         {headerGroups.map((headerGroup, i) => (
//           <tr key={`tr-${i}`} {...removeKey(headerGroup.getHeaderGroupProps())}>
//             {headerGroup.headers.map((column) => (
//               <th
//                 key={`${column.id}`}
//                 {...removeKey(column.getHeaderProps())}
//                 data-testid={`${testid}-header-${column.id}`}
//               >
//                 {column.render("Header")}
//               </th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody {...getTableBodyProps()} key="tbody">
//         {rows.map((row, i) => {
//           prepareRow(row);
//           const rowStyle = {
//             background: i % 2 === 0 ? "#e3ebfc" : "#ffffff",
//           };
//           return (
//             <Fragment key={`row-${i}`}>
//               {row.cells[0].isGrouped ||
//               (!row.cells[0].isGrouped && row.allCells[3].value) ? (
//                 <tr style={rowStyle} key={`row-${i}`}>
//                   {row.cells.map((cell, _index) => {
//                     return (
//                       <td
//                         key={`${cell.column.id}`}
//                         {...removeKey(cell.getCellProps())}
//                         data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}`}
//                         // Stryker disable next-line ObjectLiteral
//                         style={{
//                           background: cell.isGrouped
//                             ? "inherit"
//                             : cell.isAggregated
//                               ? "inherit"
//                               : null,
//                           color: cell.isGrouped
//                             ? "#4a4f4f"
//                             : cell.isAggregated
//                               ? "#4a4f4f"
//                               : "#4a4f4f",
//                           fontWeight: cell.isGrouped
//                             ? "bold"
//                             : cell.isAggregated
//                               ? "bold"
//                               : "normal",
//                         }}
//                       >
//                         {cell.isGrouped ? (
//                           <>
//                             <span
//                               {...row.getToggleRowExpandedProps()}
//                               data-testid={`${testid}-cell-row-${cell.row.index}-col-${cell.column.id}-expand-symbols`}
//                             >
//                               {row.subRows.length > 1
//                                 ? row.isExpanded
//                                   ? "➖ "
//                                   : "➕ "
//                                 : null}
//                             </span>{" "}
//                             {cell.render("Cell")}
//                           </>
//                         ) : cell.isAggregated ? (
//                           cell.render("Aggregated")
//                         ) : (
//                           cell.render("Cell")
//                         )}
//                         <></>
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ) : null}
//             </Fragment>
//           );
//         })}
//       </tbody>
//     </Table>
//   );
// }