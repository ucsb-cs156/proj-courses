import Plaintext from "main/components/Utils/Plaintext";

export default {
  title: "components/Utils/Plaintext",
  component: Plaintext,
};

const Template = (args) => {
  return <Plaintext {...args} />;
};

export const Empty = Template.bind({});
Empty.args = {
  text: " ",
};

export const Multiline = Template.bind({});

Multiline.args = {
  text: "foo\nbar\n\nbaz",
};
