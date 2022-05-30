import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/CoursesUtils"
import { hasRole } from "main/utils/currentUser";

// import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

export default function CourseTable({ courses, currentUser }) {

    // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        []
    );
    // Stryker enable all
    
    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', 
        },
        {
            Header: 'Enrollment Code',
            accessor: 'enrollCd',
        },
        {
            Header: 'Personal Schedule ID',
            accessor: 'psId',
        },
        {
            Header: 'Quarter',
            accessor: 'quarter',
        },
    ];

    const columnsIfUser = [
        ...columns,
        // ButtonColumn("Edit", "primary", editCallback, "PersonalSchedulesTable"),
        ButtonColumn("Delete", "danger", deleteCallback, "CoursesTable")
    ]

    const columnsToDisplay = hasRole(currentUser, "ROLE_USER") ? columnsIfUser : columns;

    return <OurTable
        data={courses}
        columns={columnsToDisplay}
        testid={"CourseTable"}
    />;
};