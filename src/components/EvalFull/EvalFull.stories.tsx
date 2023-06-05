import { Meta, StoryObj } from "@storybook/react";
import { tree3 } from "../examples/trees";

import { EvalFull } from "./";

const meta: Meta<typeof EvalFull> = {
  title: "Application/Component Library/EvalFull",
  component: EvalFull,
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EvalFull>;

export const Default: Story = {
  args: {
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
