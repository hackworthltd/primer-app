import { Meta, StoryObj } from "@storybook/react";

import { Toolbar } from "./";

const meta: Meta<typeof Toolbar> = {
  title: "Application/Component Library/Toolbar",
  component: Toolbar,
  decorators: [
    (Story) => (
      <div className="absolute">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
  args: {
    initialMode: "tree",
    level: "Expert",
    redoAvailable: true,
    undoAvailable: true,
  },
};
