import { ComponentStory, ComponentMeta } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { exampleSessionsMeta } from "@/components/examples/sessions";

import { SessionList } from "./";

const defaultQueryClient = new QueryClient();

export default {
  title: "Application/Component Library/Sessions/SessionList",
  component: SessionList,
  argTypes: {
    sessions: { control: "object", name: "List of sessions" },
  },
} as ComponentMeta<typeof SessionList>;

const Template: ComponentStory<typeof SessionList> = (args) => (
  <QueryClientProvider client={defaultQueryClient}>
    <SessionList {...args} />
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {
  sessions: exampleSessionsMeta(),
};
