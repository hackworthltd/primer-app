import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CreateDefModal, CreateDefModalProps, DefType } from "./";

const allDefTypes: DefType[] = ["definition", "type"];

export default {
  title: "Application/Component Library/ActionPanel/CreateDefModal",
  component: CreateDefModal,
  argTypes: {
    defType: {
      description: "Type of definition to create.",
      options: allDefTypes,
      control: { type: "radio" },
    },
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
  // There's no good way to control this in Storybook, so we hardcode
  // the names for now. See:
  //
  // https://github.com/storybookjs/storybook/issues/17518
  moduleDefNames: new Set(["Foo", "Bar"]),
  open: true,
  defType: "definition",
};
