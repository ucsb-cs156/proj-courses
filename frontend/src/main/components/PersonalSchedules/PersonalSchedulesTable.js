import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/PersonalScheduleUtils";
import { useNavigate } from "react-router-dom";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

export default function PersonalSchedulesTable({
  personalSchedules,
  showButtons = true,
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/personalschedules/edit/${cell.row.original.id}`);
  };

  const detailsCallback = (cell) => {
    navigate(`/personalschedules/details/${cell.row.original.id}`);
  };
  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/personalschedules/all"],
  );
  // Stryker restore all

  // Stryker disable all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    const id = String(cell.row.original.id);
    if (localStorage["CourseForm-psId"] === id) {
      localStorage.removeItem("CourseForm-psId");
    }
    deleteMutation.mutate(cell);
  };
  // Stryker restore all

  const columns = [
    {
      header: "id",
      accessorKey: "id", // accessor is the "key" in the data
    },

    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Quarter",
      accessorKey: "quarter",
      cell: ({ cell }) => yyyyqToQyy(cell.row.original.quarter),
      id: "quarter",
    },
  ];

  const buttonColumns = [
    ...columns,
    ButtonColumn(
      "Details",
      "primary",
      detailsCallback,
      "PersonalSchedulesTable",
    ),
    ButtonColumn("Edit", "primary", editCallback, "PersonalSchedulesTable"),
    ButtonColumn("Delete", "danger", deleteCallback, "PersonalSchedulesTable"),
  ];

  const columnsToDisplay = showButtons ? buttonColumns : columns;

  return (
    <OurTable
      data={personalSchedules}
      columns={columnsToDisplay}
      testid={"PersonalSchedulesTable"}
    />
  );
}
