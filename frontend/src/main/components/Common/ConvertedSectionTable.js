import OurTable from "main/components/OurTable";
import { yyyyqToQyy } from "main/utils/quarterUtilities";
import {
    formatDays,
    formatInstructors,
    formatLocation,
    formatTime,
    formatStatus,
    convertToFraction,
} from "main/utils/sectionUtils.js";


function ConvertedSectionTable({ sections, testid = "ConvertedSectionTable" }) {
  const columns = [
    {
      header: "Quarter",
      accessorKey: "quarter",
      cell: ({ row }) =>  yyyyqToQyy(row.original.courseInfo.quarter)
    },
    {
      header: "CourseId",
      accessorKey: "courseId",
      cell: ({ row }) => row.original.courseInfo.courseId 
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
      cell: ({ row }) => convertToFraction(row.original.section.enrolledTotal, row.original.section.maxEnroll),
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
    }
  ];

  return (
    <OurTable
      data={sections}
      columns={columns}
      testid={testid}
    />
  );
}

export default ConvertedSectionTable;


