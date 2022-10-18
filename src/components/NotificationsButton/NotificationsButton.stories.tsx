import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { Appearance, NotificationsButtonProps } from "./";
import { NotificationsButton } from "./";

const appearances: Array<Appearance> = ["plain", "notifications"];

export default {
  title: "Application/Component Library/NotificationsButton",
  component: NotificationsButton,
  argTypes: {
    appearance: {
      description: "Pre-defined appearances.",
      options: appearances,
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof NotificationsButton>;

const Template: ComponentStory<typeof NotificationsButton> = (
  args: NotificationsButtonProps
) => <NotificationsButton {...args} />;

export const Single = Template.bind({});
Single.args = {
  appearance: "plain",
};
