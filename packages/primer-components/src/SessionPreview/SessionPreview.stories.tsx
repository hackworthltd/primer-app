import { ComponentStory, ComponentMeta } from "@storybook/react";
import { v4 as uuidv4 } from "uuid";

import { SessionPreview } from "./SessionPreview";

export default {
  title: "Application/Component Library/SessionPreview",
  component: SessionPreview,
  argTypes: {
    session: { control: "object", name: "Session metadata" },
  },
} as ComponentMeta<typeof SessionPreview>;

const id1: string = uuidv4();
const id2: string = uuidv4();
const id3: string = uuidv4();
const id4: string = uuidv4();
const id5: string = uuidv4();

const Template: ComponentStory<typeof SessionPreview> = (args) => (
  <SessionPreview {...args} />
);

export const English = Template.bind({});
English.args = {
  session: {
    id: id1,
    name: "Example program",
    lastModified: new Date("2021-08-15T23:17:50.918Z"),
    url: "https://primer.fly.dev/#connect?session=" + id1,
  },
};

export const Japanese = Template.bind({});
Japanese.args = {
  session: {
    id: id2,
    name: "サンプルプログラム",
    lastModified: new Date("2021-08-07T10:12:03.332Z"),
    url: "https://primer.fly.dev/#connect?session=" + id2,
  },
};

export const SimplifiedChinese = Template.bind({});
SimplifiedChinese.args = {
  session: {
    id: id3,
    name: "示例程序",
    lastModified: new Date("2021-07-10T09:00:01.000Z"),
    url: "https://primer.fly.dev/#connect?session=" + id3,
  },
};

export const Arabic = Template.bind({});
Arabic.args = {
  session: {
    id: id4,
    name: "برنامج مثال",
    lastModified: new Date("2021-08-20T03:20:59.999Z"),
    url: "https://primer.fly.dev/#connect?session=" + id4,
  },
};

export const Emoji = Template.bind({});
Emoji.args = {
  session: {
    id: id5,
    name: "😄😂🤣🤗 🦊 🦈",
    lastModified: new Date("2021-07-23T11:53:13.730Z"),
    url: "https://primer.fly.dev/#connect?session=" + id5,
  },
};
