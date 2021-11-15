import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { Appearance, ActionButtonProps } from "./ActionButton";
import { ActionButton } from "./ActionButton";

const appearances: Array<Appearance> = ["primary", "warning"];

export default {
  title: "Application/Component Library/Buttons/ActionButton",
  component: ActionButton,
  argTypes: {
    appearance: {
      description: "Pre-defined appearances.",
      options: appearances,
      control: { type: "radio" },
    },
    label: {
      description: "The button label.",
      control: "text",
    },
    description: {
      description: "The action description.",
      control: "text",
    },
  },
} as ComponentMeta<typeof ActionButton>;

const Template: ComponentStory<typeof ActionButton> = (
  args: ActionButtonProps
) => (
  <>
    <div className="flex flex-row items-center w-1/2">
      <ActionButton {...args} />
    </div>
  </>
);

export const Single = Template.bind({});
Single.args = {
  appearance: "primary",
  label: "λx",
  description: "Make a function with an input",
};

const AllButtonsTemplate: ComponentStory<typeof ActionButton> = () => (
  <>
    <h1 className="text-xl">Primary</h1>
    <div className="flex flex-row justify-around items-center mt-4 mb-8 w-1/2">
      <ActionButton
        label="λx"
        description="Make a function with an input"
        appearance="primary"
      />
    </div>

    <h1 className="text-xl">Warning</h1>
    <div className="flex flex-row justify-around items-center mt-4 mb-8 w-1/2">
      <ActionButton label="⌦" description="Delete" appearance="warning" />
    </div>
  </>
);

export const Showcase = AllButtonsTemplate.bind({});
