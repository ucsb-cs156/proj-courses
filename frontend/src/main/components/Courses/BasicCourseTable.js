import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/BasicCourseTableHelpers"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function BasicCourseTable({  courses, currentUser }) {

    const navigate = useNavigate();

    // Stryker disable all : hard to test for query caching

    // const deleteMutation = useBackendMutation(
    //     cellToAxiosParamsDelete,
    //     { onSuccess: onDeleteSuccess },
    //     ["/api/personalschedules/all"]
    // );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    //const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'Course Id',
            accessor: 'courseId',
        },
        {
            Header: 'Title',
            accessor: 'title',
        },
        {
            Header: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Level Code',
            accessor: 'objLevelCode',
        },
        {
            Header: 'Subject Area',
            accessor: 'subjectArea',
        },
        {
            Header: 'Units',
            accessor: 'unitsFixed',
        },
    ];

    // if (hasRole(currentUser, "ROLE_USER")) {
    //     columns.push(ButtonColumn("Add", "primary", addCallback, "BasicCourseTable"));
    // } 

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedCourses = React.useMemo(() => courses, [courses]);

    return <OurTable
        data={memoizedCourses}
        columns={memoizedColumns}
        testid={"BasicCourseTable"}
    />;
};