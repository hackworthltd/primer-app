import { ComponentStory, ComponentMeta } from "@storybook/react";
import { exampleSessionsMeta } from "@/examples/sessions";

import { SessionList } from "./SessionList";

export default {
  title: "Application/Component Library/SessionList",
  component: SessionList,
  argTypes: {
    sessions: { control: "object", name: "List of sessions" },
  },
} as ComponentMeta<typeof SessionList>;

const Template: ComponentStory<typeof SessionList> = (args) => (
  <SessionList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  sessions: exampleSessionsMeta(),
};
