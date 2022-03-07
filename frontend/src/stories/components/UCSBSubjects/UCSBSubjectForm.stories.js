import React from 'react';

import UCSBSubjectForm from "main/components/UCSBSubjects/UCSBSubjectForm"
import { ucsbSubjectsFixtures} from 'fixtures/ucsbSubjectsFixtures';

export default {
    title: 'components/UCSBSubjects/UCSBSubjectForm',
    component: UCSBSubjectForm
};


const Template = (args) => {
    return (
        <UCSBSubjectForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    ucsbSubject: ucsbSubjectsFixtures.oneSubject ,
    submitText: "",
    submitAction: () => { }
};

