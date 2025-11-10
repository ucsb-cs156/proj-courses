import React from "react";
import SectionsTableBase from "main/components/SectionsTableBase";
import sectionsTableBaseFixtures from "fixtures/sectionsTableBaseFixtures";
import primaryFixtures from "fixtures/primaryFixtures";
import { http, HttpResponse } from "msw";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";

export default {
  title: "components/SectionsTableBase",
  component: SectionsTableBase,
};

const Template = (args) => {
  return <SectionsTableBase {...args} />;
};

const testid = "SectionsTable";

export const f24_math_lowerDiv = Template.bind({});
f24_math_lowerDiv.args = {
  data: primaryFixtures.f24_math_lowerDiv,
  columns: sectionsTableBaseFixtures.getExampleColumns(
    `${testid}-f24_math_lowerDiv`,
  ),
  testid: `${testid}-f24_math_lowerDiv`,
};

export const singleLectureSectionWithNoDiscussion = Template.bind({});
singleLectureSectionWithNoDiscussion.args = {
  data: primaryFixtures.singleLectureSectionWithNoDiscussion,
  columns: sectionsTableBaseFixtures.getExampleColumns(
    `${testid}-singleLectureSectionWithNoDiscussion`,
  ),
  testid: `${testid}-singleLectureSectionWithNoDiscussion`,
};

export const Empty = Template.bind({});
Empty.args = {
  data: [],
  columns: sectionsTableBaseFixtures.getExampleColumns(`${testid}-Empty`),
  testid: `${testid}-Empty`,
};

export const f24_math_lowerDiv_expanded_columns = Template.bind({});
f24_math_lowerDiv_expanded_columns.args = {
  data: primaryFixtures.f24_math_lowerDiv,
  columns: sectionsTableBaseFixtures.getExampleColumnsWithInfoAndAddToSchedule(
    `${testid}-f24_math_lowerDiv_expanded_columns`,
  ),
  testid: `${testid}-f24_math_lowerDiv_expanded_columns`,
};

f24_math_lowerDiv_expanded_columns.parameters = {
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
