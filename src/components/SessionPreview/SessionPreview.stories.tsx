import { ComponentStory, ComponentMeta } from "@storybook/react";
import * as examples from "@/components/examples/sessions";

import { SessionPreview } from "./";

export default {
  title: "Application/Component Library/Sessions/SessionPreview",
  component: SessionPreview,
  argTypes: {
    session: { control: "object", name: "Session metadata" },
    onClickDelete: { action: "delete" },
  },
} as ComponentMeta<typeof SessionPreview>;

const Template: ComponentStory<typeof SessionPreview> = (args) => (
  <SessionPreview {...args} />
);

export const English = Template.bind({});
English.args = {
  session: examples.englishSession,
};

export const Japanese = Template.bind({});
Japanese.args = {
  session: examples.japaneseSession,
};

export const SimplifiedChinese = Template.bind({});
SimplifiedChinese.args = {
  session: examples.simplifiedChineseSession,
};

export const Arabic = Template.bind({});
Arabic.args = {
  session: examples.arabicSession,
};

export const Emoji = Template.bind({});
Emoji.args = {
  session: examples.emojiSession,
};
