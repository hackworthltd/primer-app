import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Branding } from "./";

export default {
  title: "Application/Component Library/Branding",
  component: Branding,
} as ComponentMeta<typeof Branding>;

const Template: ComponentStory<typeof Branding> = () => <Branding />;

export const Default = Template.bind({});
