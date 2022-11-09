import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ActionInput } from ".";

export default {
  title: "Application/Component Library/ActionInput",
  component: ActionInput,
  argTypes: {
    onSubmit: {
      description: "The event handler for text submission.",
      action: "submit",
    },
  },
} as ComponentMeta<typeof ActionInput>;

export const Default: ComponentStory<typeof ActionInput> = (args) => (
  <div className="w-96">
    <ActionInput {...args} />
  </div>
);
