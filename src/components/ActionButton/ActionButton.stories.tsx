import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { ActionButtonProps } from "./";
import { ActionButton } from "./";

export default {
  title: "Application/Component Library/Buttons/ActionButton",
  component: ActionButton,
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
  level: "Expert",
  action: { tag: "Input", contents: "MakeLam" },
};

const AllButtonsTemplate: ComponentStory<typeof ActionButton> = (args) => (
  <>
    {/*
     Let's replace this background color hack with a proper
     ActionPanel component. See:
     https://github.com/hackworthltd/primer-app/issues/140
     */}

    <h1 className="text-xl">Primary</h1>
    <div className="mt-4 mb-8 flex w-1/2 flex-row items-center justify-around bg-grey-primary p-8">
      <ActionButton
        {...args}
        level="Expert"
        action={{ tag: "Input", contents: "MakeLam" }}
      />
    </div>

    <h1 className="text-xl">Warning</h1>
    <div className="mt-4 mb-8 flex w-1/2 flex-row items-center justify-around bg-grey-primary p-8">
      <ActionButton
        {...args}
        level="Expert"
        action={{ tag: "NoInput", contents: "DeleteExpr" }}
      />
    </div>
  </>
);

export const Showcase = AllButtonsTemplate.bind({});
