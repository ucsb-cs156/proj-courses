
import React from 'react';
import SectionsTableBase from 'main/components/SectionsTableBase';
import { oneSection, threeSections, fiveSections, gigaSections } from 'fixtures/sectionFixtures';
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
import { convertToFraction, formatDays, formatInstructors, formatLocation, formatTime, isSection } from "main/utils/sectionUtils.js";

function getFirstVal(values) {
    return values[0];
};

export default {
    title: 'components/SectionsTableBase',
    component: SectionsTableBase
};

const Template = (args) => {
    return (
        <SectionsTableBase {...args} />
    )
};

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

        Cell: ({ cell: { value } }) => value.substring(0, value.length-2)
    },
    {
        Header: 'Title',
        accessor: 'courseInfo.title',
        disableGroupBy: true,

        aggregate: getFirstVal,
        Aggregated: ({ cell: { value } }) => `${value}`
    },
    {
        // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
        Header: 'Is Section?',
        accessor: (row) => isSection(row.section.section),
        // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
        id: 'isSection',
    },
    {
        Header: 'Enrolled',
        accessor: (row) => convertToFraction(row.section.enrolledTotal, row.section.maxEnroll),
        disableGroupBy: true,
        id: 'enrolled',

        aggregate: getFirstVal,
        Aggregated: ({ cell: { value } }) => `${value}`
    },
    {
        Header: 'Location',
        accessor: (row) => formatLocation(row.section.timeLocations),
        disableGroupBy: true,
        id: 'location',

        aggregate: getFirstVal,
        Aggregated: ({ cell: { value } }) => `${value}`
    },
    {
        Header: 'Days',
        accessor: (row) => formatDays(row.section.timeLocations),
        disableGroupBy: true,
        id: 'days',

        aggregate: getFirstVal,
        Aggregated: ({ cell: { value } }) => `${value}`
    },
    {
        Header: 'Time',
        accessor: (row) => formatTime(row.section.timeLocations),
        disableGroupBy: true,
        id: 'time',

        aggregate: getFirstVal,
        Aggregated: ({ cell: { value } }) => `${value}`
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

        aggregate: getFirstVal,
        Aggregated: ({ cell: { value } }) => `${value}`
    }
];


const testid = "SectionsTable";
const columnsToDisplay = columns;

export const Empty = Template.bind({});

Empty.args = {
    data: [],
    columns: columnsToDisplay,
    testid: `${testid}-empty`
};


export const OneSection = Template.bind({});

OneSection.args = {
    data: oneSection,
    columns: columnsToDisplay,
    testid: `${testid}-OneSection`
};


export const ThreeSections = Template.bind({});

ThreeSections.args = {
    data: threeSections,
    columns: columnsToDisplay,
    testid: `${testid}-ThreeSections`
};

export const FiveSections = Template.bind({});

FiveSections.args = {
    data: fiveSections,
    columns: columnsToDisplay,
    testid: `${testid}-FiveSections`
};


export const GigaSections = Template.bind({});

GigaSections.args = {
    data: gigaSections,
    columns: columnsToDisplay,
    testid: `${testid}-GigaSections`
};


