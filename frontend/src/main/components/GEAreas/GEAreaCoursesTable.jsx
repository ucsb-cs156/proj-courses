import React from "react";
import OurTable from "main/components/OurTable";
import { yyyyqToQyy } from "main/utils/quarterUtilities";

const getGeneralEducationAreas = (course) => {
  const areas = course.generalEducation;
  if (!areas || !Array.isArray(areas)) {
    return "";
  }

  return areas
    .map((area) => {
      if (!area) {
        return "";
      }
      if (typeof area === "string") {
        return area.trim();
      }
      return area.geCode ? area.geCode.trim() : area.toString();
    })
    .filter(Boolean)
    .join(", ");
};

export default function GEAreaCoursesTable({ courses }) {
  const columns = [
    {
      Header: "Quarter",
      cell: ({ cell }) => yyyyqToQyy(cell.row.original.quarter),
      id: "quarter",
    },
    {
      Header: "Course Id",
      accessor: "courseId",
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "General Education Areas",
      cell: ({ row }) => getGeneralEducationAreas(row.original),
      id: "generalEducationAreas",
    },
  ];

  return (
    <OurTable data={courses} columns={columns} testid="GEAreaCoursesTable" />
  );
}
