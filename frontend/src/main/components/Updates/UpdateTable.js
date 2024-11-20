import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/UpdateUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UpdateTable({
    updates,
    currentUser,
    testIdPrefix = "UpdateTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/updates/edit/${cell.row.values.subjectArea}`);
  };
  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    [],
  );
  // Stryker restore all

  // Stryker disable all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate({ cell: cell });
  };
  // Stryker restore all

  const columns = [
    {
      Header: "Subject Area",
      accessor: "subjectArea",
    },
    {
      Header: "Quarter",
      accessor: "quarter",
    },
    {
      Header: "Saved",
      accessor: "saved",
    },
    {
      Header: "Updated",
      accessor: "updated",
    },
    {
      Header: "Errors",
      accessor: "errors",
    },
    {
      Header: "Last Update",
      accessor: "lastUpdate",
    },
  ];

//   const columnsIfUser = [
//     ...columns,
//     ButtonColumn("Delete", "danger", deleteCallback, "UpdateTable"),
//   ];

//   const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN")
//     ? columnsIfUser
//     : columns;

  const columnsIfAdmin = [
    ...columns,
    ButtonColumn("Edit", "primary", editCallback, "UpdateTable"),
    ButtonColumn("Delete", "danger", deleteCallback, "UpdateTable"),
  ];

  const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN")
    ? columnsIfAdmin
    : columns;

  return (
    <OurTable
      data={updates}
      columns={columnsToDisplay}
      testid={testIdPrefix}
    />
  );
}
