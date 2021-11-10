import { ComponentStory, ComponentMeta } from "@storybook/react";
import { v4 as uuidv4 } from "uuid";
import { SessionMeta } from "@hackworthltd/primer-types";

import { SessionList } from "./SessionList";

export default {
  title: "Application/Component Library/SessionList",
  component: SessionList,
  argTypes: {
    sessions: { control: "object", name: "List of sessions" },
  },
} as ComponentMeta<typeof SessionList>;

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
      url: "https://primer.fly.dev/#connect?session=" + id1,
    },
    {
      id: id2,
      name: "Just playing around",
      lastModified: new Date("2021-08-07T10:12:03.332Z"),
      url: "https://primer.fly.dev/#connect?session=" + id2,
    },
    {
      id: id3,
      name: "😄😂🤣🤗 🦊 🦈",
      lastModified: new Date("2021-07-23T11:53:13.730Z"),
      url: "https://primer.fly.dev/#connect?session=" + id3,
    },
    {
      id: id4,
      name: "Exercise 2.3(b)",
      lastModified: new Date("2021-07-10T09:00:01.000Z"),
      url: "https://primer.fly.dev/#connect?session=" + id4,
    },
    {
      id: id5,
      name: "Not yet working",
      lastModified: new Date("2021-08-20T03:20:59.999Z"),
      url: "https://primer.fly.dev/#connect?session=" + id5,
    },
  ];
}

const Template: ComponentStory<typeof SessionList> = (args) => (
  <SessionList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  sessions: exampleSessionsMeta(),
};
