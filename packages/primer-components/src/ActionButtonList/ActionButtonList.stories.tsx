import { ComponentStory, ComponentMeta } from "@storybook/react";
import type { ActionButtonProps } from "@/ActionButton/ActionButton";

import { ActionButtonList } from "./ActionButtonList";

export default {
  title: "Application/Component Library/ActionButtonList",
  component: ActionButtonList,
  argTypes: {
    actions: { control: "object", name: "List of actions" },
  },
} as ComponentMeta<typeof ActionButtonList>;

const exampleTypeActions = (): ActionButtonProps[] => {
  return [
    {
      appearance: "primary",
      label: "→",
      description: "Construct a function type",
    },
    {
      appearance: "primary",
      label: "$",
      description: "Construct a type application",
    },
    {
      appearance: "primary",
      label: "∀",
      description: "Construct a polymorphic type",
    },
    {
      appearance: "warning",
      label: "↑",
      description: "Replace parent with this subtree",
    },
    {
      appearance: "warning",
      label: "⌦",
      description: "Delete this type constructor",
    },
  ];
};

const exampleTermActions = (): ActionButtonProps[] => {
  return [
    {
      appearance: "primary",
      label: "λx",
      description: "Make a function with an input",
    },
    {
      appearance: "primary",
      label: "m",
      description: "Pattern match",
    },
    {
      appearance: "primary",
      label: "$",
      description: "Apply function",
    },
    {
      appearance: "primary",
      label: "@",
      description: "Apply type",
    },
    {
      appearance: "primary",
      label: "Λx",
      description: "Make a type abstraction",
    },
    {
      appearance: "primary",
      label: ":",
      description: "Annotate this expression with a type",
    },
    {
      appearance: "warning",
      label: "↑",
      description: "Replace parent with this subtree",
    },
    {
      appearance: "warning",
      label: "⌦",
      description: "Delete this expression",
    },
  ];
};

const Template: ComponentStory<typeof ActionButtonList> = (args) => (
  <>
    <div className="flex flex-col w-1/2">
      <ActionButtonList {...args} />
    </div>
  </>
);

export const TypeExamples = Template.bind({});
TypeExamples.args = {
  actions: exampleTypeActions(),
};

export const TermExamples = Template.bind({});
TermExamples.args = {
  actions: exampleTermActions(),
};
