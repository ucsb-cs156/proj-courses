import React from "react";
import JobsSearchForm from "main/components/Jobs/JobsSearchForm";

export default {
  title: "components/Jobs/JobsSearchForm",
  component: JobsSearchForm,
};

const Template = (args) => <JobsSearchForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  updateSortField: (x) => {
    console.log("updateSortField:", x);
  },
  updateSortDirection: (x) => {
    console.log("updateSortDirection:", x);
  },
  updatePageSize: (x) => {
    console.log("updatePageSize:", x);
  },
};
