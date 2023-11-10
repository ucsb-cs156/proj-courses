import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/UCSBSubjectUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBSubjectsTable({ subjects, currentUser }) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/UCSBSubjects/edit/${cell.row.values.subjectCode}`);
  };

  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/UCSBSubjects/all"],
  );
  // Stryker enable all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "SubjectCode",
      accessor: "subjectCode",
    },
    {
      Header: "SubjectTranslation",
      accessor: "subjectTranslation",
    },
    {
      Header: "DeptCode",
      accessor: "deptCode",
    },
    {
      Header: "CollegeCode",
      accessor: "collegeCode",
    },
    {
      Header: "RelatedDeptCode",
      accessor: "relatedDeptCode",
    },
    {
      Header: "Inactive",
      accessor: (row) => String(row.inactive),
      id: "inactive",
    },
  ];

  const columnsIfAdmin = [
    ...columns,
    ButtonColumn("Edit", "primary", editCallback, "UCSBSubjectsTable"),
    ButtonColumn("Delete", "danger", deleteCallback, "UCSBSubjectsTable"),
  ];

  const columnsToDisplay = hasRole(currentUser, "ROLE_ADMIN")
    ? columnsIfAdmin
    : columns;

  return (
    <OurTable
      data={subjects}
      columns={columnsToDisplay}
      testid={"UCSBSubjectsTable"}
    />
  );
}
