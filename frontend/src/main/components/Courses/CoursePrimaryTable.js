/* istanbul ignore file */
import React from "react";
import PrimaryTable from "main/components/Common/PrimaryTable";

import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

import {
  formatDays,
  formatInstructors,
  formatLocation,
  formatTime,
  getSection,
  getSectionField,
  enrollmentFraction,
} from "main/utils/sectionUtils.js";

export default function CoursePrimaryTable({
  primaries,
  testId = "CoursePrimaryTable",
}) {
  const columns = React.useMemo(
    () => [
      {
        id: "expander", // Unique ID for the expander column
        header: ({ table }) => (
          <button
            data-testId={`${testId}-expand-all-rows`}
            {...{
              onClick: table.getToggleAllRowsExpandedHandler(),
            }}
          >
            {table.getIsAllRowsExpanded() ? "➖" : "➕"}
          </button>
        ),
        cell: ({ row }) =>
          row.getCanExpand() ? (
            <button
              data-testId={`${testId}-row-${row.index}-expand-button`}
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: "pointer" },
              }}
            >
              {row.getIsExpanded() ? "➖" : "➕"}
            </button>
          ) : (
            <span data-testid={`${testId}-row-${row.index}-cannot-expand`} />
          ),
        // This is important for indenting sub-rows
        // We'll apply this style in the render, but you can define it here too
        // For sub-rows, you might want to adjust cell content for clarity
      },
      {
        accessorKey: "courseId",
        header: "Course ID",
        cell: ({ row, getValue }) => (
          <div style={{ paddingLeft: `${row.depth * 2}rem` }}>{getValue()}</div>
        ),
      },
      {
        header: "Quarter",
        accessorKey: "quarter",
        cell: ({ row }) =>
          row.original.quarter ? yyyyqToQyy(row.original.quarter) : "",
      },
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        header: "Enrolled",
        accessorKey: "enrolled",
        cell: ({ row }) => enrollmentFraction(row),
      },
      {
        id: "location",
        header: "Location",
        cell: ({ row }) => formatLocation(getSection(row).timeLocations),
      },
      {
        id: "days",
        header: "Days",
        cell: ({ row }) => formatDays(getSection(row).timeLocations),
      },
      {
        id: "time",
        header: "Time",
        cell: ({ row }) => formatTime(getSection(row).timeLocations),
      },
      {
        id: "instructor",
        header: "Instructor",
        cell: ({ row }) => formatInstructors(getSection(row).instructors),
      },
      {
        accessorKey: "enrollCode",
        header: "Enroll Code",
        cell: ({ row }) => getSectionField(row, "enrollCode"),
      },
    ],
    [testId],
  );

  return (
    <PrimaryTable
      data={primaries}
      columns={columns}
      testid={"CoursePrimaryTable"}
    />
  );
}
