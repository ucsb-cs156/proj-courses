import React from "react";
import SectionsTable from "main/components/Sections/SectionsTable";
import { http, HttpResponse } from "msw";

import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
import primaryFixtures from "fixtures/primaryFixtures";

// import {
//   oneSection,
//   threeSections,
//   fiveSections,
//   gigaSections,
// } from "fixtures/sectionFixtures";

// import primaryFixtures from "fixtures/primaryFixtures";

export default {
  title: "components/Sections/SectionsTable",
  component: SectionsTable,
};

const Template = (args) => {
  return <SectionsTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  sections: [],
};
Empty.parameters = {
  msw: [
    http.get("/api/personalschedules/all", () => {
      return HttpResponse.json(
        personalScheduleFixtures.threePersonalSchedules,
        {
          status: 200,
        },
      );
    }),
  ],
};  

export const f24_math_lowerDiv = Template.bind({});

f24_math_lowerDiv.args = {
  sections: primaryFixtures.f24_math_lowerDiv
};
f24_math_lowerDiv.parameters = {
  msw: [
    http.get("/api/personalschedules/all", () => {
      return HttpResponse.json(
        personalScheduleFixtures.threePersonalSchedules,
        {
          status: 200,
        },
      );
    }),
  ],
};

// export const OneSection = Template.bind({});

// OneSection.args = {
//   sections: oneSection,
// };

// export const ThreeSections = Template.bind({});

// ThreeSections.args = {
//   sections: threeSections,
// };

// export const FiveSections = Template.bind({});

// FiveSections.args = {
//   sections: fiveSections,
// };

// export const GigaSections = Template.bind({});

// GigaSections.args = {
//   sections: gigaSections,
// };
