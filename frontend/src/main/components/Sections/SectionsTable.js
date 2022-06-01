import SectionsTableBase from "main/components/SectionsTableBase";

import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
import { convertToFraction, formatDays, formatInstructors, formatLocation, formatTime, isSectionAsString} from "main/utils/sectionUtils.js";

export default function SectionsTable({ sections }) {


    // Stryker enable all 

    const columns = [
        {
            Header: 'Quarter',
            accessor: (row) => yyyyqToQyy(row.courseInfo.quarter),
            disableGroupBy: true,
            id: 'quarter',
        },
        {
            Header: 'Course ID',
            accessor: 'courseInfo.courseId',
        },
        {
            Header: 'Title',
            accessor: 'courseInfo.title',
            disableGroupBy: true,
        },
        {
            Header: 'Is Section?',
            accessor: (row) => isSectionAsString(row.section.section),
            id: 'isSection',
        },
        {
            Header: 'Enrolled',
            accessor: (row) => convertToFraction(row.section.enrolledTotal, row.section.maxEnroll),
            disableGroupBy: true,
            id: 'enrolled',
        },
        {
            Header: 'Location',
            accessor: (row) => formatLocation(row.section.timeLocations),
            disableGroupBy: true,
            id: 'location',
        },
        {
            Header: 'Days',
            accessor: (row) => formatDays(row.section.timeLocations),
            disableGroupBy: true,
            id: 'days',
        },
        {
            Header: 'Time',
            accessor: (row) => formatTime(row.section.timeLocations),
            disableGroupBy: true,
            id: 'time',
        },
        {
            Header: 'Instructor',
            accessor: (row) => formatInstructors(row.section.instructors),
            disableGroupBy: true,
            id: 'instructor',
        },        
        {
            Header: 'Enroll Code',
            accessor: 'section.enrollCode', 
            disableGroupBy: true,
        }
    ];

    const testid = "SectionsTable";

    const columnsToDisplay = columns;

    return <SectionsTableBase
        data={sections}
        columns={columnsToDisplay}
        testid={testid}
    />;
};