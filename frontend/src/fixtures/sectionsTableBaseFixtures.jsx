import { yyyyqToQyy } from "main/utils/quarterUtilities";
import AddToScheduleModal from "main/components/PersonalSchedules/AddToScheduleModal";
import {
  formatDays,
  formatInstructors,
  formatLocation,
  formatTime,
  formatStatus,
  enrollmentFraction,
  getSection,
  getSectionField,
  renderInfoLink,
  shouldShowAddToScheduleLink,
  getQuarter,
} from "main/utils/sectionUtils.jsx";

const exampleAddToScheduleCallback = (section, schedule) => {
  // Execute the mutation with the provided data
  // In a real implementation, there would be a third parameter for the backend mutation callback
  const dataFinal = {
    enrollCd: section.section.enrollCode,
    psId: schedule,
  };
  window.alert(
    `In a real application, invoke the POST /api/courses/post with data ${JSON.stringify(dataFinal)}`,
  );
  // This is where you would invoke mutation.mutate(dataFinal);
};

const sectionsTableBaseFixtures = {};

sectionsTableBaseFixtures.getExampleColumns = (testid) => [
  {
    id: "expander", // Unique ID for the expander column
    header: ({ table }) => (
      <button
        data-testid={`${testid}-expand-all-rows`}
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
          data-testid={`${testid}-row-${row.index}-expand-button`}
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: "pointer" },
          }}
        >
          {row.getIsExpanded() ? "➖" : "➕"}
        </button>
      ) : (
        <span data-testid={`${testid}-row-${row.index}-cannot-expand`} />
      ),
    // This is important for indenting sub-rows
    // We'll apply this style in the render, but you can define it here too
    // For sub-rows, you might want to adjust cell content for clarity
  },
  {
    header: "Quarter",
    accessorKey: "quarter",
    cell: ({ row }) =>
      row.original.quarter ? yyyyqToQyy(row.original.quarter) : "",
  },
  {
    accessorKey: "courseId",
    header: "Course ID",
    cell: ({ row, getValue }) => (
      <div style={{ paddingLeft: `${row.depth * 2}rem` }}>{getValue()}</div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => formatStatus(getSection(row)),
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
];

sectionsTableBaseFixtures.getExampleColumnsWithInfoAndAddToSchedule = (
  testid,
) => [
  ...sectionsTableBaseFixtures.getExampleColumns(testid),
  {
    header: "Info",
    accessorKey: "info",
    id: "info",
    cell: ({ row }) => renderInfoLink(row, testid),
  },
  {
    header: "Action",
    id: "action",
    cell: ({ row }) => {
      if (shouldShowAddToScheduleLink(row)) {
        return (
          <div className="d-flex align-items-center gap-2">
            <AddToScheduleModal
              section={getSection(row)}
              quarter={getQuarter(row)}
              onAdd={(section, schedule) =>
                exampleAddToScheduleCallback(section, schedule)
              }
              schedules={[]}
            />
          </div>
        );
      }
      return <span data-testid={`${testid}-row-${row.index}-no-action`} />;
    },
  },
];

export default sectionsTableBaseFixtures;
