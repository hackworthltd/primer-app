import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Sidebar, SidebarProps } from "./";

export default {
  title: "Application/Component Library/Sidebar",
  argTypes: {
    onClickAdd: {
      description: 'The event handler for the "+" button.',
      action: "add",
    },
    onClickDef: {
      description: "The event handler for a type or definition button.",
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
    />
  </div>
);
