import { Meta, StoryObj } from "@storybook/react";

import { DefsToolbar } from "./";

const meta: Meta<typeof DefsToolbar> = {
  title: "Application/Component Library/DefsToolbar",
  component: DefsToolbar,
  decorators: [
    (Story) => (
      <div className="absolute">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DefsToolbar>;

export const Default: Story = {};
