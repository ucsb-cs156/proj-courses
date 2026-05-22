import { useMemo } from "react";
import OurTable from "main/components/OurTable";
import SectionsTableBase from "main/components/SectionsTableBase";
import { yyyyqToQyy } from "main/utils/quarterUtilities";
import {
  formatDays,
  formatInstructors,
  formatLocation,
  formatTime,
  formatStatus,
  convertToFraction,
} from "main/utils/sectionUtils.jsx";

const TESTID = "ConvertedSectionTable";

const BASE_COLUMNS = [
  {
    header: "Quarter",
    accessorKey: "quarter",
    cell: ({ row }) => yyyyqToQyy(row.original.courseInfo.quarter),
  },
  {
    header: "CourseId",
    accessorKey: "courseId",
    cell: ({ row }) => row.original.courseInfo.courseId,
  },
  {
    header: "Title",
    accessorKey: "title",
    cell: ({ row }) => row.original.courseInfo.title,
  },
  {
    header: "EnrollCd",
    accessorKey: "enrollCode",
    cell: ({ row }) => row.original.section.enrollCode,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => formatStatus(row.original.section),
  },
  {
    header: "Enrolled",
    accessorKey: "enrolled",
    cell: ({ row }) =>
      convertToFraction(
        row.original.section.enrolledTotal,
        row.original.section.maxEnroll,
      ),
  },
  {
    header: "Days",
    accessorKey: "days",
    cell: ({ row }) => formatDays(row.original.section.timeLocations),
  },
  {
    header: "Time",
    accessorKey: "time",
    cell: ({ row }) => formatTime(row.original.section.timeLocations),
  },
  {
    header: "Location",
    accessorKey: "location",
    cell: ({ row }) => formatLocation(row.original.section.timeLocations),
  },
  {
    header: "Instructors",
    accessorKey: "instructors",
    cell: ({ row }) => formatInstructors(row.original.section.instructors),
  },
  {
    header: "Section",
    accessorKey: "section",
    cell: ({ row }) => row.original.section.section,
  },
  {
    header: "Summer Session",
    accessorKey: "summer_session",
    cell: ({ row }) => row.original.section.session?.replace(/^0+/, ""),
  },
];

const EXPANDER_COLUMN = {
  id: "expander",
  header: ({ table }) => (
    <button
      data-testid={`${TESTID}-expand-all-rows`}
      type="button"
      onClick={table.getToggleAllRowsExpandedHandler()}
    >
      {table.getIsAllRowsExpanded() ? "➖" : "➕"}
    </button>
  ),
  cell: ({ row }) =>
    row.getCanExpand() ? (
      <button
        data-testid={`${TESTID}-row-${row.index}-expand-button`}
        type="button"
        onClick={row.getToggleExpandedHandler()}
        style={{ cursor: "pointer" }}
      >
        {row.getIsExpanded() ? "➖" : "➕"}
      </button>
    ) : (
      <span data-testid={`${TESTID}-row-${row.index}-cannot-expand`} />
    ),
};

const GROUPED_COLUMNS = [EXPANDER_COLUMN, ...BASE_COLUMNS];

function isLectureSectionCode(sectionCode) {
  return sectionCode.endsWith("00");
}

function getLectureSectionPrefix(sectionCode) {
  return sectionCode.replace(/0+$/, "");
}

function courseKey(quarter, courseId) {
  return `${quarter}|${courseId}`;
}

// Function that groups sections with the right lecture from the original sections object
function buildGroupedSectionRows(flatSections) {
  const sectionsByCourse = new Map();

  for (let j = 0; j < flatSections.length; j++) {
    const entry = flatSections[j];
    if (isLectureSectionCode(entry.section.section)) {
      continue;
    }

    const key = courseKey(entry.courseInfo.quarter, entry.courseInfo.courseId);
    if (!sectionsByCourse.has(key)) {
      sectionsByCourse.set(key, []);
    }
    sectionsByCourse.get(key).push(entry);
  }

  const result = [];

  for (let i = 0; i < flatSections.length; i++) {
    const entry = flatSections[i];
    const sectionCode = entry.section.section;

    if (!isLectureSectionCode(sectionCode)) {
      continue;
    }

    const { quarter, courseId } = entry.courseInfo;
    const prefix = getLectureSectionPrefix(sectionCode);
    const subRows = (
      sectionsByCourse.get(courseKey(quarter, courseId)) || []
    ).filter((section) => section.section.section.startsWith(prefix));

    result.push({
      ...entry,
      subRows,
    });
  }

  return result;
}

function GroupedConvertedSectionTable({ sections }) {
  const groupedData = useMemo(
    () => buildGroupedSectionRows(sections),
    [sections],
  );

  return (
    <SectionsTableBase
      data={groupedData}
      columns={GROUPED_COLUMNS}
      testid={TESTID}
    />
  );
}

function ConvertedSectionTable({
  sections,
  groupSectionsUnderLectures = false,
}) {
  if (groupSectionsUnderLectures) {
    return <GroupedConvertedSectionTable sections={sections} />;
  }

  return <OurTable data={sections} columns={BASE_COLUMNS} testid={TESTID} />;
}

export default ConvertedSectionTable;
