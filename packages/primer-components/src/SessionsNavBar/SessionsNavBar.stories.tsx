import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { SessionsNavBarProps } from "./SessionsNavBar";
import { SessionsNavBar } from "./SessionsNavBar";
import { exampleAccount } from "@/examples/accounts";

export default {
  title: "Application/Component Library/Sessions/SessionsNavBar",
  component: SessionsNavBar,
  argTypes: {
    account: {
      description: "The current account.",
      control: "object",
    },
    onClickNewProgram: {
      description: "the onClick handler for the \"New program\" button.",
      action: "clicked"
    },
  },
} as ComponentMeta<typeof SessionsNavBar>;

const Template: ComponentStory<typeof SessionsNavBar> = (
  args: SessionsNavBarProps
) => <SessionsNavBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  account: exampleAccount,
};
