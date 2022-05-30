import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/PersonalScheduleUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

export default function PersonalSchedulesTable({ personalSchedules, currentUser }) {
    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/personalschedules/edit/${cell.row.values.id}`)
    }

    const coursesCallback = (cell) => {
        navigate(`/courses/psid/list`, { state: { id: cell.row.values.id} })
    }

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/personalschedules/all"]
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
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Quarter',
            accessor: (row, _rowIndex) => yyyyqToQyy(row.quarter),
            id: 'quarter',
        },
    ];

    const columnsIfUser = [
        ...columns,
        ButtonColumn("Edit", "primary", editCallback, "PersonalSchedulesTable"),
        ButtonColumn("Delete", "danger", deleteCallback, "PersonalSchedulesTable"),
        ButtonColumn("Courses", "success", coursesCallback, "PersonalSchedulesTable")
    ]

    const columnsToDisplay = hasRole(currentUser, "ROLE_USER") ? columnsIfUser : columns;

    return <OurTable
        data={personalSchedules}
        columns={columnsToDisplay}
        testid={"PersonalSchedulesTable"}
    />;
};