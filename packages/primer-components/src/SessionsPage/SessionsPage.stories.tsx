import { ComponentStory, ComponentMeta } from "@storybook/react";
import { v4 as uuidv4 } from "uuid";
import type { SessionMeta, Account } from "@hackworthltd/primer-types";
import { SessionsPage } from "./SessionsPage";

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

function exampleSessionsMeta(): SessionMeta[] {
  const id1: string = uuidv4();
  const id2: string = uuidv4();
  const id3: string = uuidv4();
  const id4: string = uuidv4();
  const id5: string = uuidv4();

  return [
    {
      id: id1,
      name: "Map test",
      lastModified: new Date("2021-08-15T23:17:50.918Z"),
    },
    {
      id: id2,
      name: "Just playing around",
      lastModified: new Date("2021-08-07T10:12:03.332Z"),
    },
    {
      id: id3,
      name: "😄😂🤣🤗 🦊 🦈",
      lastModified: new Date("2021-07-23T11:53:13.730Z"),
    },
    {
      id: id4,
      name: "Exercise 2.3(b)",
      lastModified: new Date("2021-07-10T09:00:01.000Z"),
    },
    {
      id: id5,
      name: "Not yet working",
      lastModified: new Date("2021-08-20T03:20:59.999Z"),
    },
  ];
}

const Template: ComponentStory<typeof SessionsPage> = (args) => (
  <SessionsPage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  account: account,
  sessions: exampleSessionsMeta(),
};
