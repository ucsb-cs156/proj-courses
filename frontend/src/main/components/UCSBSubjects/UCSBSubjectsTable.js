import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
// import { toast } from "react-toastify";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBSubjectUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBSubjectsTable({ subjects, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/ucsbsubjects/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/ucsbsubjects/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'SubjectCode',
            accessor: 'subjectCode',
        },
        {
            Header: 'SubjectTranslation',
            accessor: 'subjectTranslation',
        },
        {
            Header: 'DeptCode',
            accessor: 'deptCode',
        },
        {
            Header: 'CollegeCode',
            accessor: 'collegeCode',
        },
        {
            Header: 'RelatedDeptCode',
            accessor: 'relatedDeptCode',
        },
        {
            Header: 'Inactive',
            accessor: (row) => String(row.inactive),
            id: 'inactive',
        }
        
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "UCSBSubjectsTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "UCSBSubjectsTable"));
    } 

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedDates = React.useMemo(() => subjects, [subjects]);

    return <OurTable
        data={memoizedDates}
        columns={memoizedColumns}
        testid={"UCSBSubjectsTable"}
    />;
};