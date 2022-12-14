import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { CreateTypeDefModalProps } from "./";
import { CreateTypeDefModal } from "./";

export default {
  title: "Application/Component Library/Sidebar/CreateTypeDefModal(Enum)",
  component: CreateTypeDefModal,
  argTypes: {
    onClose: {
      description: "The onClose handler.",
      action: "clicked",
    },
    onSubmit: {
      description: "The onSubmit handler.",
      action: "submitted",
    },
  },
} as ComponentMeta<typeof CreateTypeDefModal>;

const Template: ComponentStory<typeof CreateTypeDefModal> = (
  args: CreateTypeDefModalProps
) => <CreateTypeDefModal {...args} />;

export const Default = Template.bind({});
Default.args = {};
