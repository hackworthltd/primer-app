import { ComponentStory, ComponentMeta } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as examples from "@/components/examples/sessions";

import { SessionPreview } from "./";

const defaultQueryClient = new QueryClient();

export default {
  title: "Application/Component Library/Sessions/SessionPreview",
  component: SessionPreview,
  argTypes: {
    session: { control: "object", name: "Session metadata" },
  },
} as ComponentMeta<typeof SessionPreview>;

const Template: ComponentStory<typeof SessionPreview> = (args) => (
  <QueryClientProvider client={defaultQueryClient}>
    <SessionPreview {...args} />
  </QueryClientProvider>
);

export const English = Template.bind({});
English.args = {
  session: examples.englishSessionMeta,
};

export const Japanese = Template.bind({});
Japanese.args = {
  session: examples.japaneseSessionMeta,
};

export const SimplifiedChinese = Template.bind({});
SimplifiedChinese.args = {
  session: examples.simplifiedChineseSessionMeta,
};

export const Arabic = Template.bind({});
Arabic.args = {
  session: examples.arabicSessionMeta,
};

export const Emoji = Template.bind({});
Emoji.args = {
  session: examples.emojiSessionMeta,
};
