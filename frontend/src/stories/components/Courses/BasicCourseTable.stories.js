import React from 'react';

import BasicCourseTable from 'main/components/Courses/BasicCourseTable';
import { coursesFixtures } from 'fixtures/courseFixtures';
// import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/Courses/BasicCourseTable',
    component: BasicCourseTable
};

const Template = (args) => {
    return (
        <BasicCourseTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    courses: []
};

export const twoCourses = Template.bind({});

twoCourses.args = {
    courses: coursesFixtures.classesLectureOnly
};


// export const ThreeSubjectsUser = Template.bind({});
// ThreeSubjectsUser.args = {
//     personalSchedules: personalScheduleFixtures.threePersonalSchedules,
//     currentUser: currentUserFixtures.adminUser
// };

