import OurTable from "main/components/OurTable";

import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
import { hhmmTohhmma, convertToTimeRange } from "main/utils/timeUtils.js";
import { convertToFraction, spaceOut } from "main/utils/sectionUtils.js";

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
            Header: 'Enroll Code',
            accessor: 'enrollCode', 
        },
        {
            Header: 'Title',
            accessor: 'title', 
        },
        {
            Header: 'Enrolled',
            accessor: (row) => convertToFraction(row.enrolledTotal, row.maxEnroll),
            id: 'enrolled',
        },
        {
            Header: 'Location',
            accessor: (row) => spaceOut(row.room, row.building),
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