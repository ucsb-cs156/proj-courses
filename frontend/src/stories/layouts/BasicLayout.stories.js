import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "layouts/BasicLayout/BasicLayout",
  component: BasicLayout,
};

const Template = () => <BasicLayout />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/oauth2/authorization/google", (request) => {
      toast(`Generated: ${request.method} ${request.url}`);
      return HttpResponse.json(
        {},
        {
          status: 200,
        },
      );
    }),
  ],
};
