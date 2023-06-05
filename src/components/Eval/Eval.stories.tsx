import { Meta, StoryObj } from "@storybook/react";
import { tree3 } from "../examples/trees";

import { Eval } from "./";

const meta: Meta<typeof Eval> = {
  title: "Application/Component Library/Eval",
  component: Eval,
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Eval>;

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
