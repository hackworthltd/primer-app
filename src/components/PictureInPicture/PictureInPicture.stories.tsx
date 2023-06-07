import { Meta, StoryObj } from "@storybook/react";
import { tree3 } from "../examples/trees";

import { PictureInPicture } from "./";

const meta: Meta<typeof PictureInPicture> = {
  title: "Application/Component Library/PictureInPicture",
  component: PictureInPicture,
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PictureInPicture>;

export const Default: Story = {
  args: {
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
