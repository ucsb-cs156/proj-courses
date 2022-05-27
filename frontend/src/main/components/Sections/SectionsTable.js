import OurTable from "main/components/OurTable";

import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
import { hhmmTohhmma, convertToTimeRange } from "main/utils/timeUtils.js";
import { convertToFraction, spaceOut, isSectionAsString } from "main/utils/sectionUtils.js";

export default function SectionsTable({ sections }) {


    // Stryker enable all 

    const columns = [
        {
            Header: 'Quarter',
            accessor: (row) => yyyyqToQyy(row.quarter),
            id: 'quarter',
        },
        {
            Header: 'Course ID',
            accessor: 'courseId',
        },
        {
            Header: 'Title',
            accessor: 'title', 
        },
        {
            Header: 'Is Section?',
            accessor: (row) => isSectionAsString(row.section),
            id: 'isSection',
        },
        {
            Header: 'Enrolled',
            accessor: (row) => convertToFraction(row.enrolledTotal, row.maxEnroll),
            id: 'enrolled',
        },
        {
            Header: 'Location',
            accessor: (row) => spaceOut(row.building, row.room),
            id: 'location',
        },
        {
            Header: 'Days',
            accessor: 'days',
        },
        {
            Header: 'Time',
            accessor: (row) => convertToTimeRange(hhmmTohhmma(row.beginTime), hhmmTohhmma(row.endTime)),
            id: 'time',
        },
        {
            Header: 'Instructor',
            accessor: 'instructor',
        },        {
            Header: 'Enroll Code',
            accessor: 'enrollCode', 
        }
    ];

    const testid = "SectionsTable";

    const columnsToDisplay = columns;

    return <OurTable
        data={sections}
        columns={columnsToDisplay}
        testid={testid}
    />;
};