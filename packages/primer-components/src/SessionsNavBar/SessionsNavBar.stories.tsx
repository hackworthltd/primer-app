import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SessionsNavBar } from "./SessionsNavBar";

export default {
  title: "Application/Component Library/SessionsNavBar",
  component: SessionsNavBar,
  controls: {
    hideNoControlsWarning: true,
  },
} as ComponentMeta<typeof SessionsNavBar>;

const Template: ComponentStory<typeof SessionsNavBar> = () => (
  <SessionsNavBar />
);

export const Default = Template.bind({});
Default.args = {};
