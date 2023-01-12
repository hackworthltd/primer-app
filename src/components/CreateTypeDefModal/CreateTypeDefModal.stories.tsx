import { ComponentStory, ComponentMeta } from "@storybook/react";
import type { CreateTypeDefModalProps } from "./.";
import { CreateTypeDefModal } from "./";

export default {
  title: "Application/Component Library/Sidebar/CreateTypeDefModal",
  component: CreateTypeDefModal,
  argTypes: {
    open: {
      description: "If true, the modal is active.",
      control: { type: "boolean" },
    },
    onSubmit: {
      description: "The onSubmit handler.",
      action: "submit",
    },
    onCancel: {
      description: "The onCancel handler.",
      action: "cancel",
    },
    onClose: {
      description: "The onClose handler.",
      action: "close",
    },
  },
} as ComponentMeta<typeof CreateTypeDefModal>;

const Template: ComponentStory<typeof CreateTypeDefModal> = (
  args: CreateTypeDefModalProps
) => {
  return <CreateTypeDefModal {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  // There's no good way to control this in Storybook, so we hardcode the names
  // for now. See:
  //
  // https://github.com/storybookjs/storybook/issues/17518
  moduleTypeDefNames: new Set(["Foo", "Bar"]),
  open: true,
};
