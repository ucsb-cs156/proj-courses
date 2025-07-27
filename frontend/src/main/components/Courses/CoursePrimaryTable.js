import React from "react";
import PrimaryTable from "main/components/Common/PrimaryTable";

// import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

export default function CoursePrimaryTable({ primaries }) {

  const columns = [
    {
      id: 'expander', // Unique ID for the expander column
      header: ({ table }) => (
        <button
          {...{
            onClick: () => { 
              table.getToggleAllRowsExpandedHandler();
            },
          }}
        >
          {table.getIsAllRowsExpanded() ? '-' : '+'}
        </button>
      ),
      cell: ({ row }) => {
        console.log(`Row ID: ${row.id}, Can Expand: ${row.getCanExpand()}, Is Expanded: ${row.getIsExpanded()}`);
        return row.getCanExpand() ? (
          <button
            {...{
              onClick: () => {
                row.getToggleExpandedHandler();
              },
              style: { cursor: 'pointer' },
            }}
          >
            {row.getIsExpanded() ? '-' : '+'}
          </button>
        ) : (
          '🔵' // Or null, or an empty span for rows that can't expand
        )},
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
      accessorFn: (row) => row.primary.enrollCode,
      header: 'Enroll Code',
    },
    {
      accessorKey: 'section',
      accessorFn: (row) => row.primary.section,
      header: 'Section',
    },
    {
      accessorKey: 'enrolledTotal',
      accessorFn: (row) => row.primary.enrolledTotal,
      header: 'Enrolled',
    },
    {
      accessorKey: 'maxEnroll',
      accessorFn: (row) => row.primary.maxEnroll,
      header: 'Max Enroll',
    },
    {
      accessorFn: row => row.primary.timeLocations?.[0]?.days, // Accessing nested data for primary row
      id: 'days',
      header: 'Days',
    },
    {
      accessorFn: row => row.primary.timeLocations?.[0]?.beginTime,
      id: 'beginTime',
      header: 'Begin Time',
    },
    {
      accessorFn: row => row.primary.timeLocations?.[0]?.endTime,
      id: 'endTime',
      header: 'End Time',
    },
    {
      accessorFn: row => row.primary.timeLocations?.[0]?.room,
      id: 'room',
      header: 'Room',
    },
    {
      accessorFn: row => row.primary.instructors?.[0]?.instructor,
      id: 'instructor',
      header: 'Instructor',
    },
    // You can add more columns for secondary sections here,
    // and they will automatically apply to subRows as well if the accessor matches.
  ];


  return (
    <PrimaryTable data={primaries} columns={columns} testid={"CoursePrimaryTable"} />
  );
}
