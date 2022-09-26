import { ActionType } from "@hackworthltd/primer-types";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { ActionButtonProps } from "./ActionButton";
import { ActionButton } from "./ActionButton";

const appearances: Array<ActionType> = ["Primary", "Destructive"];

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

    <div className="mt-4 mb-8 flex w-1/2 flex-row items-center justify-around bg-grey-primary p-8">
      <ActionButton {...args} />
    </div>
  </>
);

export const Single = Template.bind({});
Single.args = {
  actionType: "Primary",
  name: { tag: "Code", contents: "λx" },
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
    <div className="mt-4 mb-8 flex w-1/2 flex-row items-center justify-around bg-grey-primary p-8">
      <ActionButton
        name={{ tag: "Code", contents: "λx" }}
        description="Make a function with an input"
        actionType="Primary"
      />
    </div>

    <h1 className="text-xl">Warning</h1>
    <div className="mt-4 mb-8 flex w-1/2 flex-row items-center justify-around bg-grey-primary p-8">
      <ActionButton
        name={{ tag: "Prose", contents: "⌦" }}
        description="Delete"
        actionType="Destructive"
      />
    </div>
  </>
);

export const Showcase = AllButtonsTemplate.bind({});
