import React, { useState } from 'react';

import BasicCourseTable from "main/components/Courses/BasicCourseTable";

// import { quarterRange } from 'main/utils/quarterUtilities';

export default {
    title: 'components/Courses/BasicCourseTable',
    component: BasicCourseTable
};

const Template = (args) => {
    const [courses, setCourses] = useState(args.courses[0]);
    const [checks, setChecks] = useState(args.checks[0]);

    return (
        < BasicCourseTable 
        courses={courses} 
        checks={checks}
        controlId={"SampleControlId"}
        label={"Courses"} 
        {...args} />
    )
};


export const twoCourses = Template.bind({});
twoCourses.args = {
    courses:[
      {
      "quarter": "20211",
      "courseId": "CMPSC     8  ",
      "title": "INTRO TO COMP SCI",
      "description": "Introduction to computer program development for students with little to no programming experience. Basic programming concepts, variables and expressions, data and control structures, algorithms, debugging, program design, and documentation.",
      "objLevelCode": "U",
      "subjectArea": "CMPSC ",
      "unitsFixed": 4,
    },
    {
      "quarter": "20211",
      "courseId": "CMPSC     16  ",
      "title": "PROBLEM SOLVING I",
      "description": "Fundamental building blocks for solving problems using computers. Topics include basic computer organization and programming constructs: memory CPU, binary arithmetic, variables, expressions, statements, conditionals, iteration, functions, parameters, recursion, primitive and composite data types, and basic operating system and debugging tools.",
      "objLevelCode": "U",
      "subjectArea": "CMPSC ",
      "unitsFixed": 4,
    }
  ],
  checks: [false, false, false],
  displayQuarter: "F21"
};

// export const ThreeQuarters = Template.bind({});
// ThreeQuarters.args = {
//     quarters: quarterRange("20204", "20212")
// };

// export const ManyQuarters = Template.bind({});
// ManyQuarters.args = {
//     quarters: quarterRange("20081", "20213")
// };
