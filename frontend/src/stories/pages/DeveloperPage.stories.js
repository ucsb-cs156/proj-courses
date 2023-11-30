import React from "react";

import DeveloperPage from "main/pages/DeveloperPage";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

export default {
  title: "pages/DeveloperPage",
  component: DeveloperPage,
  parameters: {
    mockData: [
      {
        url: "/api/systemInfo",
        method: "GET",
        status: 200,
        response: systemInfoFixtures.showingBoth, // alternative: systemInfoFixtures.showingNeither
      },
    ],
  },
};

const Template = () => <DeveloperPage />;

export const Default = Template.bind({});
