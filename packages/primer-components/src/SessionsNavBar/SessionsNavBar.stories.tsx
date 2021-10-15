import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { SessionsNavBarProps, Account } from "./SessionsNavBar";
import { SessionsNavBar } from "./SessionsNavBar";

const account: Account = {
  name: "Chelsea Hagon",
  email: "chelseahagon@example.com",
  avatarStyle: "jdenticon",
  imageUrl:
    "https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?ixid=MnwyNjcwMzh8MHwxfGFsbHx8fHx8fHx8fDE2MzQwNTU4MjU&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

export default {
  title: "Application/Component Library/SessionsNavBar",
  component: SessionsNavBar,
  argTypes: {
    account: {
      description: "The current account.",
      control: "object",
    },
  },
} as ComponentMeta<typeof SessionsNavBar>;

const Template: ComponentStory<typeof SessionsNavBar> = (
  args: SessionsNavBarProps
) => <SessionsNavBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  account: account,
};
