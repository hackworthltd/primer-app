import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CallToAction } from "./CallToAction";

export default {
  title: "Application/Component Library/CallToAction",
  component: CallToAction,
  controls: {
    hideNoControlsWarning: true,
  },
} as ComponentMeta<typeof CallToAction>;

const Template: ComponentStory<typeof CallToAction> = () => <CallToAction />;

export const Default = Template.bind({});
Default.parameters = {
  controls: { hideNoControlsWarning: true },
  backgrounds: { default: "dark" },
};
