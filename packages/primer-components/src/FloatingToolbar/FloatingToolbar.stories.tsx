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
    onClickMode: {
      description: 'The event handler for the "Mode" button.',
      action: "mode",
    },
    onClickRedo: {
      description: 'The event handler for the "Redo" button.',
      action: "redo",
    },
    onClickUndo: {
      description: 'The event handler for the "Undo" button.',
      action: "undo",
    },
    onClickChevron: {
      description: 'The event handler for the "Chevron" button.',
      action: "chevron",
    },
  },
} as ComponentMeta<typeof FloatingToolbar>;

export const Default: ComponentStory<typeof FloatingToolbar> = (
  args: FloatingToolbarProps
) => <FloatingToolbar {...args} />;
