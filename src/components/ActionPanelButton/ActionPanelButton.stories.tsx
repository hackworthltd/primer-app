import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { ActionPanelButtonProps, Appearance } from "./";
import { ActionPanelButton } from "./";

const appearances: Array<Appearance> = ["primary", "danger"];

export default {
  title: "Application/Component Library/Buttons/ActionPanelButton",
  component: ActionPanelButton,
  argTypes: {
    appearance: {
      description: "Pre-defined appearances.",
      options: appearances,
      control: { type: "radio" },
    },
    name: {
      description: "Button short name and style.",
      control: "object",
    },
    description: {
      description: "The button's description.",
      control: "text",
    },
    onClick: {
      description: "The onClick handler.",
      action: "clicked",
    },
  },
} as ComponentMeta<typeof ActionPanelButton>;

const Template: ComponentStory<typeof ActionPanelButton> = (
  args: ActionPanelButtonProps
) => (
  <>
    <div className="w-96">
      <ActionPanelButton {...args} />
    </div>
  </>
);

export const Single = Template.bind({});
Single.args = {
  appearance: "primary",
  name: { text: "x", style: "code" },
  description: "Use a variable",
};

const AllButtonsTemplate: ComponentStory<typeof ActionPanelButton> = (args) => (
  <>
    <h1 className="text-xl">Primary with name as code</h1>
    <div className="mb-8 mt-4 w-96">
      <ActionPanelButton
        {...args}
        appearance="primary"
        name={{ text: "x", style: "code" }}
        description="Use a variable"
      />
    </div>

    <h1 className="text-xl">Primary with no name</h1>
    <div className="mb-8 mt-4 w-96">
      <ActionPanelButton
        {...args}
        appearance="primary"
        description="Use a variable"
      />
    </div>

    <h1 className="text-xl">Primary, name only, code</h1>
    <div className="mb-8 mt-4 w-96">
      <ActionPanelButton
        {...args}
        appearance="primary"
        name={{ text: "x", style: "code" }}
      />
    </div>

    <h1 className="text-xl">Primary, name only, code, long</h1>
    <div className="mb-8 mt-4 w-96">
      <ActionPanelButton
        {...args}
        appearance="primary"
        name={{
          text: "This is a really really really long and verbose name",
          style: "code",
        }}
      />
    </div>

    <h1 className="text-xl">Danger with name as prose</h1>
    <div className="mb-8 mt-4 w-96">
      <ActionPanelButton
        {...args}
        appearance="danger"
        name={{ text: "⌫", style: "prose" }}
        description="Delete everything"
      />
    </div>

    <h1 className="text-xl">Danger with no name</h1>
    <div className="mb-8 mt-4 w-96">
      <ActionPanelButton {...args} appearance="danger" description="Cancel" />
    </div>
  </>
);

export const Showcase = AllButtonsTemplate.bind({});
