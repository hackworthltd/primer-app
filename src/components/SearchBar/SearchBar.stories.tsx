import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { SearchBarProps } from "./";
import { SearchBar } from "./";

export default {
  title: "Application/Component Library/SearchBar",
  component: SearchBar,
  argTypes: {
    ariaLabel: {
      description: "The search bar label. Only visible to screen readers.",
    },
    placeholder: {
      description: "The search bar placeholder text.",
    },
  },
} as ComponentMeta<typeof SearchBar>;

const Template: ComponentStory<typeof SearchBar> = (args: SearchBarProps) => (
  <SearchBar {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ariaLabel: "Function search",
  placeholder: "Function name",
};
