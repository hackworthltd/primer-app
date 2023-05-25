import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { SessionsNavBarProps } from "./";
import { SessionsNavBar } from "./";
import { exampleAccount } from "@/components/examples/accounts";

export default {
  title: "Application/Component Library/Sessions/SessionsNavBar",
  component: SessionsNavBar,
  argTypes: {
    account: {
      description: "The current account.",
      control: "object",
    },
    onClickNewProgram: {
      description: 'the onClick handler for the "New program" button.',
      action: "clicked",
    },
    onSubmitSearch: {
      description: "the onSubmit handler for the search form.",
      action: "submitSearch",
    },
    onChangeSearch: {
      description: "the onChange handler for the search form.",
      action: "changeSearch",
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
