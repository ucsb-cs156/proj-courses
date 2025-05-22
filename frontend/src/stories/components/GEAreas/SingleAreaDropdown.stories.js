import React, { useState } from "react";
import { http, HttpResponse } from "msw";
import SingleAreaDropdown from "main/components/GEAreas/SingleAreaDropdown"; // Update path if needed
import {
  _oneGEArea,
  _twoGEAreas,
  allGEAreas,
} from "fixtures/singleAreaDropdownFixtures";

export default {
  title: "components/GEAreas/SingleAreaDropdown",
  component: SingleAreaDropdown,
};

const Template = (args) => {
  const [areas, setArea] = useState(args.areas[0]);

  return (
    <SingleAreaDropdown
      areas={areas}
      //   area={area}
      setArea={setArea}
      controlId={"SampleGEControlId"}
      label={"General Education Area"}
      {...args}
    />
  );
};

export const AllGEAreas = Template.bind({});
AllGEAreas.args = {
  areas: allGEAreas,
};
AllGEAreas.parameters = {
  msw: [
    http.get("/api/public/generalEducationInfo", () => {
      return HttpResponse.json(allGEAreas, {
        status: 200,
      });
    }),
  ],
};
