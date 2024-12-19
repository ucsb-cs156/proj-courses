import React from "react";

import GenericDropdown from "main/components/Utils/GenericDropdown";

export default {
  title: "components/Utils/GenericDropdown",
  component: GenericDropdown,
};

const Template = (args) => {
  return <GenericDropdown {...args} />;
};

export const PizzaToppings = Template.bind({});
PizzaToppings.args = {
  values: ["Cheese", "Mushroom", "Pepperoni"],
  setValue: (v) => console.log(`value: ${v}`),
  controlId: "PizzaToppings",
  label: "Pizza Toppings",
};

export const Sodas = Template.bind({});
Sodas.args = {
  values: ["Coke", "Pepsi", "Dr. Pepper"],
  setValue: (v) => console.log(`value: ${v}`),
  controlId: "Sodas",
  label: "Sodas",
};
