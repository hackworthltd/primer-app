import { Meta, StoryObj } from "@storybook/react";
import { tree3 } from "../examples/trees";

import { FloatingToolbar } from "./";

const meta: Meta<typeof FloatingToolbar> = {
  title: "Application/Component Library/FloatingToolbar",
  component: FloatingToolbar,
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FloatingToolbar>;

export const Default: Story = {
  args: {
    initialMode: "tree",
    initialPosition: { x: 100, y: 50 },
    moduleName: ["Primer", "Examples"],
    evalFull: {
      request: () => {
        return;
      },
      result: { tag: "EvalFullRespTimedOut", contents: tree3 },
    },
    level: "Expert",
    defs: ["footballGame", "whatsopposite"],
  },
};
