import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import {
  convertToFraction,
  formatInstructors,
  formatLocation,
  formatTime,
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/sectionUtils.js";
import { hasRole } from "main/utils/currentUser";

export default function PersonalSectionsTable({
  personalSections,
  currentUser,
  psId,
}) {
  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    //["/api/personalSections/delete"],
    [],
  );
  // Stryker restore all
  const deleteCallback = async (cell) => {
    deleteMutation.mutate({ cell, psId });
  };

  const columns = [
    {
      Header: "Course ID",
      accessor: "courseId",
    },
    {
      Header: "Enroll Code",
      accessor: "classSections[0].enrollCode",
    },
    {
      Header: "Section",
      accessor: "classSections[0].section",
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Enrolled",
      accessor: (row) =>
        convertToFraction(
          row.classSections[0].enrolledTotal,
          row.classSections[0].maxEnroll,
        ),
      id: "enrolled",
    },
    {
      Header: "Location",
      accessor: (row) => formatLocation(row.classSections[0].timeLocations),
      id: "location",
    },
    {
      Header: "Days",
      accessor: "classSections[0].timeLocations[0].days",
    },
    {
      Header: "Time",
      accessor: (row) => formatTime(row.classSections[0].timeLocations),
      id: "time",
    },
    {
      Header: "Instructor",
      accessor: (row) => formatInstructors(row.classSections[0].instructors),
      id: "instructor",
    },
  ];

  const columnsWithDelete = [
    ...columns,
    ButtonColumn("Delete", "danger", deleteCallback, "PersonalSectionsTable"),
  ];

  const testid = "PersonalSectionsTable";

  const columnsToDisplay = hasRole(currentUser,"ROLE_USER")?columnsWithDelete:columns;
  return (
    <OurTable
      data={personalSections}
      columns={columnsToDisplay}
      testid={testid}
    />
  );
}
