import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SessionsPage } from "./";
import { exampleSessionsMeta } from "@/components/examples/sessions";
import { exampleAccount } from "@/components/examples/accounts";

export default {
  title: "Application/Component Library/Sessions/SessionsPage",
  component: SessionsPage,
  argTypes: {
    sessions: { control: "object", name: "List of sessions" },
    account: { control: "object", name: "Account" },
    startIndex: {
      description: "The 1-based index of the first item shown on this page.",
      control: "number",
    },
    totalItems: {
      description: "The total number of items.",
      control: "number",
    },
    onClickNextPage: {
      description: 'The event handler for the "Next" button.',
      action: "clicked",
    },
    onClickPreviousPage: {
      description: 'The event handler for the "Previous" button.',
      action: "clicked",
    },
  },
} as ComponentMeta<typeof SessionsPage>;

const Template: ComponentStory<typeof SessionsPage> = (args) => (
  <SessionsPage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  account: exampleAccount,
  sessions: exampleSessionsMeta(),
  startIndex: 21,
  totalItems: 95,
};
