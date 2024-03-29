import { ComponentStory, ComponentMeta } from "@storybook/react";

import { BinaryTreePlaceholder } from "./";

export default {
  title: "Application/Component Library/BinaryTreePlaceholder",
  component: BinaryTreePlaceholder,
  argTypes: {
    className: { control: "text" },
  },
} as ComponentMeta<typeof BinaryTreePlaceholder>;

const Template: ComponentStory<typeof BinaryTreePlaceholder> = (args) => (
  <BinaryTreePlaceholder {...args} />
);

export const Default = Template.bind({});
Default.args = {
  className: "fill-current text-white-primary h-48 w-48",
};
