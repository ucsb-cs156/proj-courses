import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';
import primaryFixtures from 'fixtures/primaryFixtures';

function PrimaryTable({testId = "PrimaryTable" }) {

  const data = primaryFixtures.f24_math_lowerDiv;

  const columns = React.useMemo(
    () => [
      {
        id: 'expander', // Unique ID for the expander column
        header: ({ table }) => (
          <button
            {...{
              onClick: table.getToggleAllRowsExpandedHandler(),
            }}
          >
            {table.getIsAllRowsExpanded() ? '👇' : '👉'}
          </button>
        ),
        cell: ({ row }) =>
          row.getCanExpand() ? (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: 'pointer' },
              }}
            >
              {row.getIsExpanded() ? '👇' : '👉'}
            </button>
          ) : (
            '🔵' // Or null, or an empty span for rows that can't expand
          ),
        // This is important for indenting sub-rows
        // We'll apply this style in the render, but you can define it here too
        // For sub-rows, you might want to adjust cell content for clarity
      },
      {
        accessorKey: 'courseId',
        header: 'Course ID',
        cell: ({ row, getValue }) => (
          <div style={{ paddingLeft: `${row.depth * 2}rem` }}>
            {getValue()}
          </div>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
      },
      {
        accessorKey: 'enrollCode',
        header: 'Enroll Code',
      },
      {
        accessorKey: 'section',
        header: 'Section',
      },
      {
        accessorKey: 'enrolledTotal',
        header: 'Enrolled',
      },
      {
        accessorKey: 'maxEnroll',
        header: 'Max Enroll',
      },
      {
        accessorFn: row => row.timeLocations?.[0]?.days, // Accessing nested data for primary row
        id: 'days',
        header: 'Days',
      },
      {
        accessorFn: row => row.timeLocations?.[0]?.beginTime,
        id: 'beginTime',
        header: 'Begin Time',
      },
      {
        accessorFn: row => row.timeLocations?.[0]?.endTime,
        id: 'endTime',
        header: 'End Time',
      },
      {
        accessorFn: row => row.timeLocations?.[0]?.room,
        id: 'room',
        header: 'Room',
      },
      {
        accessorFn: row => row.instructors?.[0]?.instructor,
        id: 'instructor',
        header: 'Instructor',
      },
      // You can add more columns for secondary sections here,
      // and they will automatically apply to subRows as well if the accessor matches.
    ],
    []
  );

  const [expanded, setExpanded] = useState({});

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
 
  console.log("Table Row Model:", table.getRowModel().rows);
  console.log("Table State Expanded:", table.getState().expanded);

  return (
    <>
      <table data-testid={testId} className="table">
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
          {table.getRowModel().rows.map((row) => (
            <tr key={`rowId-${row.id}`}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
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
      </table>
      <pre className="text-sm">
        {JSON.stringify(table.getState().expanded, null, 2)}
      </pre>
    </>
  );
}

export default PrimaryTable;

