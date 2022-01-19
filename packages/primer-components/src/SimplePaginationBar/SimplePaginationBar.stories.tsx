import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { SimplePaginationBarProps } from "./SimplePaginationBar";
import { SimplePaginationBar } from "./SimplePaginationBar";

export default {
  title: "Application/Component Library/SimplePaginationBar",
  component: SimplePaginationBar,
  argTypes: {
    itemNamePlural: {
      description: "The name given to items (plural); e.g., \"projects\".",
      control: "text",
    },
    startIndex: {
      description: "The 1-based index of the first item shown on this page.",
      control: "number",
    },
    numItems: {
      description: "The number of items displayed on this page.",
      control: "number",
    },
    totalItems: {
      description: "The total number of items.",
      control: "number",
    },
  },
} as ComponentMeta<typeof SimplePaginationBar>;

const Template: ComponentStory<typeof SimplePaginationBar> = (args: SimplePaginationBarProps) => (
  <SimplePaginationBar {...args} />
);

export const Default = Template.bind({});
Default.args = {
  itemNamePlural: "sessions",
  startIndex: 21,
  numItems: 10,
  totalItems: 95
};
