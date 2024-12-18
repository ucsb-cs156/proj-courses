import OurPagination from "main/components/Utils/OurPagination";

export default {
  title: "components/Utils/OurPagination",
  component: OurPagination,
};

const Template = (args) => {
  return <OurPagination {...args} />;
};

export const Total_10_Max_5 = Template.bind({});
Total_10_Max_5.args = {
  totalPages: 10,
  maxPages: 5,
  updateActivePage: (p) => {
    console.log(`Now on page ${p}`);
  },
};

export const Total_5_Max_10 = Template.bind({});
Total_5_Max_10.args = {
  totalPages: 5,
  maxPages: 10,
  updateActivePage: (p) => {
    console.log(`Now on page ${p}`);
  },
};
