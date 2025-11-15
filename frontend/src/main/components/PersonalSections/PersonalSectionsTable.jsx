import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/PersonalSectionsUtils";
import {
  convertToFraction,
  formatDays,
  formatInstructors,
  formatLocation,
  formatTime,
  renderInfoLink,
} from "main/utils/sectionUtils.jsx";
import { hasRole } from "main/utils/currentUser";

const testid = "PersonalSectionsTable";

export default function PersonalSectionsTable({
  personalSections,
  psId,
  currentUser,
}) {
  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    [],
  );
  // Stryker restore all

  // Stryker disable all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate({ cell: cell, psId: psId });
  };
  // Stryker restore all

  const columns = [
    {
      header: "Course ID",
      accessorKey: "courseId",
    },
    {
      header: "Enroll Code",
      cell: ({ cell }) => cell.row.original.classSections[0].enrollCode,
      id: "enrollCode",
    },
    {
      header: "Section",
      cell: ({ cell }) => cell.row.original.classSections[0].section,
      id: "section",
    },
    {
      header: "Title",
      id: "title",
      cell: ({ row }) => {
        const section = row.original.classSections[0];

        const simpleRow = {
          id: row.id,
          original: {
            quarter: row.original.quarter,
            primary: {
              enrollCode: section.enrollCode,
            },
          },
          depth: 0,
        };

        return renderInfoLink(
          simpleRow,
          "PersonalSectionsTable",
          row.original.title,
        );
      },
    },
    {
      header: "Enrolled",
      cell: ({ cell }) =>
        convertToFraction(
          cell.row.original.classSections[0].enrolledTotal,
          cell.row.original.classSections[0].maxEnroll,
        ),
      id: "enrolled",
    },
    {
      header: "Location",
      cell: ({ cell }) =>
        formatLocation(cell.row.original.classSections[0].timeLocations),
      id: "location",
    },
    {
      header: "Days",
      cell: ({ cell }) =>
        formatDays(cell.row.original.classSections[0].timeLocations),
      id: "days",
    },
    {
      header: "Time",
      cell: ({ cell }) =>
        formatTime(cell.row.original.classSections[0].timeLocations),
      id: "time",
    },
    {
      header: "Instructor",
      cell: ({ cell }) =>
        formatInstructors(cell.row.original.classSections[0].instructors),
      id: "instructor",
    },
  ];

  const columnsIfUser = [
    ...columns,
    ButtonColumn("Delete", "danger", deleteCallback, "PersonalSectionsTable"),
  ];

  const columnsToDisplay = hasRole(currentUser, "ROLE_USER")
    ? columnsIfUser
    : columns;

  return (
    <OurTable
      data={personalSections}
      columns={columnsToDisplay}
      testid={testid}
    />
  );
}
