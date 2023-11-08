import { Meta, StoryObj } from "@storybook/react";

import { Spinner } from "./";

const meta: Meta<typeof Spinner> = {
  title: "Application/Component Library/Spinner",
  component: Spinner,
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    "aria-label": "Loading…",
  },
};
