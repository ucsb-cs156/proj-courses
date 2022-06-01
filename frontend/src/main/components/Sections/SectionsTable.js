import SectionsTableBase from "main/components/SectionsTableBase";

import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
import { convertToFraction, formatDays, formatInstructors, formatLocation, formatTime, isSectionAsString} from "main/utils/sectionUtils.js";


function getFirstVal(values) {
    return values[0];
};

export default function SectionsTable({ sections }) {


    // Stryker enable all 
    // Stryker disable BooleanLiteral
    const columns = [
        {
            Header: 'Quarter',
            accessor: (row) => yyyyqToQyy(row.courseInfo.quarter),
            disableGroupBy: true,
            id: 'quarter',

            aggregate: getFirstVal,
            Aggregated: ({ cell: { value } }) => `${value}`
        },
        {
            Header: 'Course ID',
            accessor: 'courseInfo.courseId',
        },
        {
            Header: 'Title',
            accessor: 'courseInfo.title',
            disableGroupBy: true,

            aggregate: getFirstVal,
            Aggregated: ({ cell: { value } }) => `${value}`
        },
        {
            Header: 'Is Section?',
            accessor: (row) => isSectionAsString(row.section.section),
            disableGroupBy: true,
            id: 'isSection',

            Aggregated: ({ cell: { _value } }) => ``
        },
        {
            Header: 'Enrolled',
            accessor: (row) => convertToFraction(row.section.enrolledTotal, row.section.maxEnroll),
            disableGroupBy: true,
            id: 'enrolled',

            Aggregated: ({ cell: { _value } }) => ``
        },
        {
            Header: 'Location',
            accessor: (row) => formatLocation(row.section.timeLocations),
            disableGroupBy: true,
            id: 'location',

            Aggregated: ({ cell: { _value } }) => ``
        },
        {
            Header: 'Days',
            accessor: (row) => formatDays(row.section.timeLocations),
            disableGroupBy: true,
            id: 'days',

            Aggregated: ({ cell: { _value } }) => ``
        },
        {
            Header: 'Time',
            accessor: (row) => formatTime(row.section.timeLocations),
            disableGroupBy: true,
            id: 'time',

            Aggregated: ({ cell: { _value } }) => ``
        },
        {
            Header: 'Instructor',
            accessor: (row) => formatInstructors(row.section.instructors),
            disableGroupBy: true,
            id: 'instructor',

            aggregate: getFirstVal,
            Aggregated: ({ cell: { value } }) => `${value}`
        },        
        {
            Header: 'Enroll Code',
            accessor: 'section.enrollCode', 
            disableGroupBy: true,

            Aggregated: ({ cell: { _value } }) => ``
        }
    ];

    const testid = "SectionsTable";

    const columnsToDisplay = columns;

    return <SectionsTableBase
        data={sections}
        columns={columnsToDisplay}
        testid={testid}
        //expand={false}
    />;
};

