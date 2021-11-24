import { ComponentStory, ComponentMeta } from "@storybook/react";
import type { Account } from "@hackworthltd/primer-types";
import { SessionsPage } from "./SessionsPage";
import { exampleSessionsMeta } from "@/examples/sessions";

export default {
  title: "Application/Component Library/SessionsPage",
  component: SessionsPage,
  argTypes: {
    sessions: { control: "object", name: "List of sessions" },
    account: { control: "object", name: "Account" },
  },
} as ComponentMeta<typeof SessionsPage>;

const account: Account = {
  name: "Chelsea Hagon",
  email: "chelseahagon@example.com",
  avatarStyle: "jdenticon",
  imageUrl:
    "https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?ixid=MnwyNjcwMzh8MHwxfGFsbHx8fHx8fHx8fDE2MzQwNTU4MjU&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const Template: ComponentStory<typeof SessionsPage> = (args) => (
  <SessionsPage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  account: account,
  sessions: exampleSessionsMeta(),
};
