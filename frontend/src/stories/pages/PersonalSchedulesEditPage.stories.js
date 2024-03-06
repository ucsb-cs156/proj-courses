import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";
import { rest } from "msw";

import PersonalSchedulesEditPage from "main/pages/PersonalSchedules/PersonalSchedulesEditPage";

export default {
    title: 'pages/PersonalSchedules/PersonalSchedulesEditPage',
    component: PersonalSchedulesEditPage
};

const Template = () => <PersonalSchedulesEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/personalschedules', (_req, res, ctx) => {
            return res(ctx.json(personalSchedulesFixtures.twoPersonalSchedules[0]));
        }),
        rest.put('/api/personalschedules', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}
