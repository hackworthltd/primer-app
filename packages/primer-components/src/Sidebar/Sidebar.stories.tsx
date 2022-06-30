import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Sidebar, SidebarProps } from "./Sidebar";

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
);
