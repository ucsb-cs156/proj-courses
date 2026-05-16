import React from "react";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/Search/GeneralEducationSearchPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import primaryFixtures from "fixtures/primaryFixtures";

import { http, HttpResponse } from "msw";

export default {
	title: "pages/GeneralEducation/GeneralEducationSearchPage",
	component: GeneralEducationSearchPage,
};

const geAreasFixture = [
	{
		requirementCode: "A1",
		requirementTranslation: "English Reading & Composition",
		collegeCode: "ENGR",
		objCode: "BS",
		courseCount: 1,
		units: 4,
		inactive: false,
	},
		{
			requirementCode: "B",
			requirementTranslation: "Foreign Language - L&S",
			collegeCode: "L&S",
			objCode: "BA",
			courseCount: 1,
			units: 4,
			inactive: false,
		},
];

const Template = () => <GeneralEducationSearchPage />;

export const LoggedIn = Template.bind({});
LoggedIn.parameters = {
	msw: [
		http.get("/api/currentUser", () => {
			return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
				status: 200,
			});
		}),
		http.get("/api/systemInfo", () => {
			return HttpResponse.json(systemInfoFixtures.showingBoth, {
				status: 200,
			});
		}),
		http.get("/api/public/generalEducationInfo", () => {
			return HttpResponse.json(geAreasFixture, {
				status: 200,
			});
		}),
		http.get("/api/personalschedules/all", () => {
			return HttpResponse.json(personalSchedulesFixtures.twoPersonalSchedules, {
				status: 200,
			});
		}),
		http.get("/api/public/primariesge", ({ request }) => {
			return HttpResponse.json(primaryFixtures.f24_math_lowerDiv, {
				status: 200,
			});
		}),
	],
};

export const LoggedOut = Template.bind({});
LoggedOut.parameters = {
	msw: [
		http.get("/api/currentUser", () => {
			return HttpResponse.status(403);
		}),
		http.get("/api/systemInfo", () => {
			return HttpResponse.json(systemInfoFixtures.showingBoth, {
				status: 200,
			});
		}),
		http.get("/api/public/generalEducationInfo", () => {
			return HttpResponse.json(geAreasFixture, {
				status: 200,
			});
		}),
		http.get("/api/public/primariesge", ({ request }) => {
			return HttpResponse.json(primaryFixtures.f24_math_lowerDiv, {
				status: 200,
			});
		}),
	],
};