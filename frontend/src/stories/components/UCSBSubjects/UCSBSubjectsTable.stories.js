import React from 'react';

import UCSBSubjectsTable from "main/components/UCSBSubjects/UCSBSubjectsTable";
import { ucsbSubjectsFixtures } from 'fixtures/ucsbSubjectsFixtures';

export default {
    title: 'components/UCSBSubjects/UCSBSubjectsTable',
    component: UCSBSubjectsTable
};

const Template = (args) => {
    return (
        <UCSBSubjectsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    subjects: []
};

export const ThreeSubjects = Template.bind({});

ThreeSubjects.args = {
    subjects: ucsbSubjectsFixtures.threeSubjects
};


