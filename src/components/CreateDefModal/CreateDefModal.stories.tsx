import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CreateDefModal, CreateDefModalProps } from "./";

export default {
  title: "Application/Component Library/Sidebar/CreateDefModal",
  component: CreateDefModal,
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
} as ComponentMeta<typeof CreateDefModal>;

const Template: ComponentStory<typeof CreateDefModal> = (
  args: CreateDefModalProps
) => {
  return <CreateDefModal {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  open: true,
};
