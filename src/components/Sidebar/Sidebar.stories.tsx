import { ComponentStory, ComponentMeta } from "@storybook/react";
import { tree3 } from "../examples/trees";

import { Sidebar, SidebarProps } from "./";

export default {
  title: "Application/Component Library/Sidebar/Sidebar",
  argTypes: {
    onClickAddTypeDef: {
      description: 'The event handler for the "+ typedef" button.',
      action: "add typedef",
    },
    onClickAddDef: {
      description: 'The event handler for the "+ def" button.',
      action: "add def",
    },
    onClickTypeDef: {
      description: "The event handler for a typedef button.",
      action: "typedef",
    },
    onClickDef: {
      description: "The event handler for a definition button.",
      action: "def",
    },
  },
} as ComponentMeta<typeof Sidebar>;

export const Default: ComponentStory<typeof Sidebar> = (args: SidebarProps) => (
  <div className="h-[32rem] w-[22rem]">
    <Sidebar
      {...args}
      prog={{
        types: ["GoalOrMiss", "WinLoseDraw"],
        defs: ["footballGame", "whatsopposite"],
        importedTypes: [],
        importedDefs: ["opposite"].concat(
          Array(30)
            .fill({})
            .map((_, i) => "def".concat(i.toString()))
        ),
      }}
      initialMode="T&D"
      shadowed={true}
      type="Direction → Direction"
      folder="Direction"
      evalFull={{
        request: () => {
          return;
        },
        result: { tag: "EvalFullRespTimedOut", contents: tree3 },
      }}
      level="Expert"
    />
  </div>
);
