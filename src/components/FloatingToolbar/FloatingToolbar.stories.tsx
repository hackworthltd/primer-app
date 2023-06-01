import { ComponentStory, ComponentMeta } from "@storybook/react";

import { FloatingToolbar, FloatingToolbarProps } from "./";

export default {
  title: "Application/Component Library/FloatingToolbar",
  component: FloatingToolbar,
  argTypes: {
    initialPosition: {
      description: "The toolbar's initial position.",
      control: "object",
    },
    onModeChange: {
      description: 'The event handler for the "Mode" button.',
      action: "mode",
    },
    onLevelChange: {
      description: 'The event handler for the "Level" button.',
      action: "level",
    },
    redoAvailable: {
      description: "Whether redo is available.",
      control: "boolean",
    },
    onClickRedo: {
      description: 'The event handler for the "Redo" button.',
      action: "redo",
    },
    undoAvailable: {
      description: "Whether undo is available.",
      control: "boolean",
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

const Template: ComponentStory<typeof FloatingToolbar> = (
  args: FloatingToolbarProps
) => (
  <div>
    <FloatingToolbar {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  initialMode: "tree",
  initialPosition: { x: 100, y: 50 },
  level: "Beginner",
};
