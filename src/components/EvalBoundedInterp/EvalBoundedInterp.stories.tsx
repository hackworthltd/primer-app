import { Meta, StoryObj } from "@storybook/react";
import { tree3 } from "../examples/trees";

import { EvalBoundedInterp } from "./";

const meta: Meta<typeof EvalBoundedInterp> = {
  title: "Application/Component Library/EvalBoundedInterp",
  component: EvalBoundedInterp,
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EvalBoundedInterp>;

export const Default: Story = {
  args: {
    moduleName: ["Primer", "Examples"],
    evalBoundedInterp: {
      request: () => {
        return;
      },
      result: { tag: "EvalBoundedInterpRespNormal", contents: tree3 },
    },
    level: "Expert",
    defs: ["footballGame", "whatsopposite"],
  },
};
