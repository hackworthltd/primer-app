import { ComponentStory, ComponentMeta } from "@storybook/react";
import { SessionNameModal, SessionNameModalProps } from "./";

export default {
  title: "Application/Component Library/Sessions/SessionNameModal",
  component: SessionNameModal,
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
} as ComponentMeta<typeof SessionNameModal>;

const Template: ComponentStory<typeof SessionNameModal> = (
  args: SessionNameModalProps
) => {
  return <SessionNameModal {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  open: true,
};
