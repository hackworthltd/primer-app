import { ComponentStory, ComponentMeta } from "@storybook/react";

import { FloatingToolbar, FloatingToolbarProps } from "./FloatingToolbar";

export default {
  title: "Application/Component Library/FloatingToolbar",
  component: FloatingToolbar,
  argTypes: {
    mode: {
      description: "Editing mode.",
      options: ["text", "tree"],
      control: { type: "radio" },
      defaultValue: "tree",
    },
  },
} as ComponentMeta<typeof FloatingToolbar>;

const Template: ComponentStory<typeof FloatingToolbar> = (
  args: FloatingToolbarProps
) => (
  <div>
    <FloatingToolbar {...args} />
  </div>
);

export const Default = Template.bind({});
