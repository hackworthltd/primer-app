import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { Size, Appearance, UIButtonProps } from "./UIButton";
import { UIButton } from "./UIButton";

const allSizes: Array<Size> = ["responsive", "sm", "md", "lg", "xl", "2xl"];
const fixedSizes: Array<Size> = ["sm", "md", "lg", "xl", "2xl"];
const appearances: Array<Appearance> = [
  "primary",
  "secondary",
  "warning",
  "danger",
  "plain",
];

export default {
  title: "Application/Component Library/Buttons/UIButton",
  component: UIButton,
  argTypes: {
    size: {
      description: "Pre-defined sizes.",
      options: allSizes,
      control: { type: "radio" },
    },
    appearance: {
      description: "Pre-defined appearances.",
      options: appearances,
      control: { type: "radio" },
    },
    text: {
      description: "The button label.",
      control: "text",
    },
    onClick: {
      description: "The onClick handler.",
      action: "clicked"
    },
  },
} as ComponentMeta<typeof UIButton>;

const Template: ComponentStory<typeof UIButton> = (args: UIButtonProps) => (
  <UIButton {...args} />
);

export const Single = Template.bind({});
Single.args = {
  size: "responsive",
  appearance: "primary",
  text: "Button",
};

const AllButtonsTemplate: ComponentStory<typeof UIButton> = (args: UIButtonProps) => (
  <>
    <h1 className="text-xl">Primary</h1>
    <div className="flex flex-row justify-around items-center mb-8">
      {fixedSizes.map((sz) => (
        <UIButton onClick={args.onClick!} text="New program" appearance="primary" size={sz} key={sz} />
      ))}
    </div>

    <h1 className="text-xl">Secondary</h1>
    <div className="flex flex-row justify-around items-center mb-8">
      {fixedSizes.map((sz) => (
        <UIButton onClick={args.onClick!} text="Settings" appearance="secondary" size={sz} key={sz} />
      ))}
    </div>

    <h1 className="text-xl">Warning</h1>
    <div className="flex flex-row justify-around items-center mb-8">
      {fixedSizes.map((sz) => (
        <UIButton onClick={args.onClick!} text="Undo" appearance="warning" size={sz} key={sz} />
      ))}
    </div>

    <h1 className="text-xl">Danger</h1>
    <div className="flex flex-row justify-around items-center mb-8">
      {fixedSizes.map((sz) => (
        <UIButton
          onClick={args.onClick!}
          text="Delete program"
          appearance="danger"
          size={sz}
          key={sz}
        />
      ))}
    </div>

    <h1 className="text-xl">Plain</h1>
    <div className="flex flex-row justify-around items-center mb-8">
      {fixedSizes.map((sz) => (
        <UIButton onClick={args.onClick!} text="Cancel" appearance="plain" size={sz} key={sz} />
      ))}
    </div>
  </>
);

export const Showcase = AllButtonsTemplate.bind({});
Showcase.args = {};
