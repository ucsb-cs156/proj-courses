import React,{ useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';
import primaryFixtures from 'fixtures/primaryFixtures';


function formatInstructorsToString(instructorsArray) {
  if (!Array.isArray(instructorsArray) || instructorsArray.length === 0) {
    return ""; 
  }
  const instructorNames = instructorsArray.map((instructorObj) => instructorObj.instructor);
  return instructorNames.join(", ");
}

function PrimaryTable({testId = "PrimaryTable" }) {

  const data = primaryFixtures.f24_math_lowerDiv;

  const getSectionField = (row, key) => ('primary' in row.original) ? row.original.primary[key] : row.original[key]
  const getSectionTimeLocationField = (row, key) => ('primary' in row.original) ? row.original.primary.timeLocations?.[0][key] : row.original.timeLocations?.[0][key]
  const getSectionInstructors = (row) => {
    const instructors = 'primary' in row.original ? row.original.primary.instructors : row.original.instructors;
    return formatInstructorsToString(instructors)
  }

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
            {table.getIsAllRowsExpanded() ? '-' : '+'}
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
              {row.getIsExpanded() ? '-' : '+'}
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
        cell: ({row}) => getSectionField(row, "enrollCode")
      },
      {
        accessorKey: 'section',
        header: 'Section',
        cell: ({row}) => getSectionField(row, 'section')
      },
      {
        accessorKey: 'enrolledTotal',
        header: 'Enrolled',
        cell: ({row}) => getSectionField(row, 'enrolledTotal')
      },
      {
        accessorKey: 'maxEnroll',
        header: 'Max Enroll',
        cell: ({row}) => getSectionField(row, 'maxEnroll')
      },
      {
        id: 'days',
        header: 'Days',
        cell: ({row}) => getSectionTimeLocationField(row, 'days')
      },
      {
        id: 'beginTime',
        header: 'Begin Time',
        cell: ({row}) => getSectionTimeLocationField(row, 'beginTime')

      },
      {
        id: 'endTime',
        header: 'End Time',
        cell: ({row}) => getSectionTimeLocationField(row, 'endTime')

      },
      {
        id: 'room',
        header: 'Room',
        cell: ({row}) => getSectionTimeLocationField(row, 'room')
      },
      {
        id: 'instructor',
        header: 'Instructor',
        cell: ({row}) => getSectionInstructors(row)
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


