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
    {/*
     Let's replace this background color hack with a proper
     ActionPanel component. See:
     https://github.com/hackworthltd/primer-app/issues/140
     */}

    <div className="flex flex-row justify-around items-center p-8 mt-4 mb-8 w-1/2 bg-grey-primary">
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
    {/*
     Let's replace this background color hack with a proper
     ActionPanel component. See:
     https://github.com/hackworthltd/primer-app/issues/140
     */}

    <h1 className="text-xl">Primary</h1>
    <div className="flex flex-row justify-around items-center p-8 mt-4 mb-8 w-1/2 bg-grey-primary">
      <ActionButton
        label="λx"
        description="Make a function with an input"
        appearance="primary"
      />
    </div>

    <h1 className="text-xl">Warning</h1>
    <div className="flex flex-row justify-around items-center p-8 mt-4 mb-8 w-1/2 bg-grey-primary">
      <ActionButton label="⌦" description="Delete" appearance="warning" />
    </div>
  </>
);

export const Showcase = AllButtonsTemplate.bind({});
