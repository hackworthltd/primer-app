import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Error } from "./";

export default {
  title: "Application/Component Library/Error",
  component: Error,
} as ComponentMeta<typeof Error>;

const Template: ComponentStory<typeof Error> = () => (
  <Error string="some error message" />
);

export const Default = Template.bind({});
