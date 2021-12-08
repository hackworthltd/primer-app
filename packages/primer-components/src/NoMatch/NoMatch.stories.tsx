import { ComponentStory, ComponentMeta } from "@storybook/react";
import { NoMatch } from "./NoMatch";

export default {
  title: "Application/Component Library/NoMatch",
  component: NoMatch,
} as ComponentMeta<typeof NoMatch>;

const Template: ComponentStory<typeof NoMatch> = () => (
  <NoMatch />
);

export const Default = Template.bind({});
