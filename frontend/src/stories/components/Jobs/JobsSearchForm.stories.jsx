import JobsSearchForm from "main/components/Jobs/JobsSearchForm";

export default {
  title: "components/Jobs/JobsSearchForm",
  component: JobsSearchForm,
};

const Template = (args) => {
  return <JobsSearchForm {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  updatePageSize: (p) => {
    console.log(`pageSize: ${p}`);
  },
  updateSortField: (s) => {
    console.log(`updateSortField: ${s}`);
  },
  updateSortDirection: (s) => {
    console.log(`updateSortDirection: ${s}`);
  },
};
