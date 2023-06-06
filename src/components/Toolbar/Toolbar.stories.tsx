import { Meta, StoryObj } from "@storybook/react";

import { Toolbar } from "./";

const meta: Meta<typeof Toolbar> = {
  title: "Application/Component Library/Toolbar",
  component: Toolbar,
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
  args: {
    initialPosition: { x: 100, y: 50 },
    initialMode: "tree",
    level: "Expert",
    redoAvailable: true,
    undoAvailable: true,
  },
};
