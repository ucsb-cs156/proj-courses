import OurTable from "main/components/OurTable";

import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
import { convertToFraction, formatDays, formatInstructors, formatLocation, formatTime, isSectionAsString } from "main/utils/sectionUtils.js";

export default function SectionsTable({ sections }) {


    // Stryker enable all 

    const columns = [
        {
            Header: 'Quarter',
            accessor: (row) => yyyyqToQyy(row.courseInfo.quarter),
            id: 'quarter',
        },
        {
            Header: 'Course ID',
            accessor: 'courseInfo.courseId',
        },
        {
            Header: 'Title',
            accessor: 'courseInfo.title', 
        },
        {
            Header: 'Is Section?',
            accessor: (row) => isSectionAsString(row.section.section),
            id: 'isSection',
        },
        {
            Header: 'Enrolled',
            accessor: (row) => convertToFraction(row.section.enrolledTotal, row.section.maxEnroll),
            id: 'enrolled',
        },
        {
            Header: 'Location',
            accessor: (row) => formatLocation(row.section.timeLocations),
            id: 'location',
        },
        {
            Header: 'Days',
            accessor: (row) => formatDays(row.section.timeLocations),
            id: 'days',
        },
        {
            Header: 'Time',
            accessor: (row) => formatTime(row.section.timeLocations),
            id: 'time',
        },
        {
            Header: 'Instructor',
            accessor: (row) => formatInstructors(row.section.instructors),
            id: 'instructor',
        },        {
            Header: 'Enroll Code',
            accessor: 'section.enrollCode', 
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
