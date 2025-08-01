import OurTable, { ButtonColumn } from "main/components/OurTable";
import ourTableFixtures from "fixtures/ourTableFixtures";

export default {
  title: "components/OurTable",
  component: OurTable,
};

const Template = (args) => {
  return <OurTable {...args} />;
};

export const SimpleExample = Template.bind({});

SimpleExample.args = {
  data: ourTableFixtures.simpleExample.data,
  columns: ourTableFixtures.simpleExample.columns,
};

export const SimpleLegacyExample = Template.bind({});

SimpleLegacyExample.args = {
  data: ourTableFixtures.simpleLegacyExample.data,
  columns: ourTableFixtures.simpleLegacyExample.columns,
};

export const NewStyleTable = Template.bind({});

NewStyleTable.args = {
  columns: ourTableFixtures.newStyleColumns.columns,
  data: ourTableFixtures.newStyleColumns.data,
};

export const ComplexArgs = Template.bind({});

ComplexArgs.args = {
  data: ourTableFixtures.complexData.data,
  columns: ourTableFixtures.complexData.columns,
};

const columnsWithButton = [
  ...ourTableFixtures.simpleExample.columns,
  ButtonColumn("Click", "primary", () => {}, "myTestId"),
];

export const SampleWithButtonColumn = Template.bind({});

SampleWithButtonColumn.args = {
  columns: columnsWithButton,
  data: ourTableFixtures.simpleExample.data,
  testid: "myTestId",
};

export const PlaceholderExample = Template.bind({});

PlaceholderExample.args = {
  columns: ourTableFixtures.placeholderExample.columns,
  data: ourTableFixtures.placeholderExample.data,
};
