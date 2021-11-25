import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SessionsPage } from "./SessionsPage";
import { exampleSessionsMeta } from "@/examples/sessions";
import { exampleAccount } from "@/examples/accounts";

export default {
  title: "Application/Component Library/SessionsPage",
  component: SessionsPage,
  argTypes: {
    sessions: { control: "object", name: "List of sessions" },
    account: { control: "object", name: "Account" },
  },
} as ComponentMeta<typeof SessionsPage>;

const Template: ComponentStory<typeof SessionsPage> = (args) => (
  <SessionsPage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  account: exampleAccount,
  sessions: exampleSessionsMeta(),
};
