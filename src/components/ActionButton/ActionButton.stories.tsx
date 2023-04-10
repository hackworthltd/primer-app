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
    <div className="w-96">
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
    <h1 className="text-xl">Primary</h1>
    <div className="mb-8 mt-4 w-96">
      <ActionButton
        {...args}
        level="Expert"
        action={{ tag: "Input", contents: "MakeLam" }}
      />
    </div>

    <h1 className="text-xl">Warning</h1>
    <div className="mb-8 mt-4 w-96">
      <ActionButton
        {...args}
        level="Expert"
        action={{ tag: "NoInput", contents: "DeleteExpr" }}
      />
    </div>
  </>
);

export const Showcase = AllButtonsTemplate.bind({});
