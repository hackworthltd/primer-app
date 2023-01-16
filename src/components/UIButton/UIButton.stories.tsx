import { ComponentStory, ComponentMeta } from "@storybook/react";

import type { ButtonType, Size, Appearance, UIButtonProps } from "./";
import { UIButton } from "./";

const allTypes: Array<ButtonType> = ["submit", "button"];
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
    className: {
      description: "Extra CSS class names.",
      control: "text",
    },
    text: {
      description: "The button label.",
      control: "text",
    },
    onClick: {
      description: "The onClick handler.",
      action: "clicked",
    },
    buttonType: {
      description: "The button type.",
      options: allTypes,
      control: { type: "radio" },
    },
    disabled: {
      description: "If true, the button is disabled.",
      control: { type: "boolean" },
    },
    hidden: {
      description: "If true, the button is hidden.",
      control: { type: "boolean" },
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

const AllButtonsTemplate: ComponentStory<typeof UIButton> = (
  args: UIButtonProps
) => (
  <>
    <h1 className="text-xl">Primary</h1>
    <div className="mb-8 flex flex-row items-center justify-around">
      {fixedSizes.map((sz) => (
        <UIButton
          buttonType={args.buttonType}
          onClick={args.onClick}
          text="New program"
          appearance="primary"
          className={args.className}
          size={sz}
          key={sz}
        />
      ))}
    </div>

    <h1 className="text-xl">Secondary</h1>
    <div className="mb-8 flex flex-row items-center justify-around">
      {fixedSizes.map((sz) => (
        <UIButton
          buttonType={args.buttonType}
          onClick={args.onClick}
          text="Settings"
          appearance="secondary"
          className={args.className}
          size={sz}
          key={sz}
        />
      ))}
    </div>

    <h1 className="text-xl">Warning</h1>
    <div className="mb-8 flex flex-row items-center justify-around">
      {fixedSizes.map((sz) => (
        <UIButton
          onClick={args.onClick}
          text="Undo"
          appearance="warning"
          className={args.className}
          size={sz}
          key={sz}
        />
      ))}
    </div>

    <h1 className="text-xl">Danger</h1>
    <div className="mb-8 flex flex-row items-center justify-around">
      {fixedSizes.map((sz) => (
        <UIButton
          onClick={args.onClick}
          text="Delete program"
          appearance="danger"
          className={args.className}
          size={sz}
          key={sz}
        />
      ))}
    </div>

    <h1 className="text-xl">Plain</h1>
    <div className="mb-8 flex flex-row items-center justify-around">
      {fixedSizes.map((sz) => (
        <UIButton
          onClick={args.onClick}
          text="Cancel"
          appearance="plain"
          className={args.className}
          size={sz}
          key={sz}
        />
      ))}
    </div>
  </>
);

export const Showcase = AllButtonsTemplate.bind({});
Showcase.args = {};
