import { OfferedAction } from "@/Types";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ActionButtonList } from "./ActionButtonList";

export default {
  title: "Application/Component Library/ActionButtonList",
  component: ActionButtonList,
  argTypes: {
    actions: { control: "object", name: "List of actions" },
  },
} as ComponentMeta<typeof ActionButtonList>;

const exampleTypeActions = (): OfferedAction[] => {
  return [
    {
      actionType: "Primary",
      name: { tag: "Code", contents: "→" },
      description: "Construct a function type",
      priority: 0,
    },
    {
      actionType: "Primary",
      name: { tag: "Code", contents: "$" },
      description: "Construct a type application",
      priority: 1,
    },
    {
      actionType: "Primary",
      name: { tag: "Code", contents: "∀" },
      description: "Construct a polymorphic type",
      priority: 2,
    },
    {
      actionType: "Destructive",
      name: { tag: "Prose", contents: "↑" },
      description: "Replace parent with this subtree",
      priority: 3,
    },
    {
      actionType: "Destructive",
      name: { tag: "Prose", contents: "⌦" },
      description: "Delete this type constructor",
      priority: 4,
    },
  ];
};

const exampleTermActions = (): OfferedAction[] => {
  return [
    {
      actionType: "Primary",
      name: { tag: "Code", contents: "λx" },
      description: "Make a function with an input",
      priority: 0,
    },
    {
      actionType: "Primary",
      name: { tag: "Code", contents: "m" },
      description: "Pattern match",
      priority: 1,
    },
    {
      actionType: "Primary",
      name: { tag: "Code", contents: "$" },
      description: "Apply function",
      priority: 2,
    },
    {
      actionType: "Primary",
      name: { tag: "Code", contents: "@" },
      description: "Apply type",
      priority: 3,
    },
    {
      actionType: "Primary",
      name: { tag: "Code", contents: "Λx" },
      description: "Make a type abstraction",
      priority: 4,
    },
    {
      actionType: "Primary",
      name: { tag: "Code", contents: ":" },
      description: "Annotate this expression with a type",
      priority: 5,
    },
    {
      actionType: "Destructive",
      name: { tag: "Prose", contents: "↑" },
      description: "Replace parent with this subtree",
      priority: 6,
    },
    {
      actionType: "Destructive",
      name: { tag: "Prose", contents: "⌦" },
      description: "Delete this expression",
      priority: 7,
    },
  ];
};

const Template: ComponentStory<typeof ActionButtonList> = (args) => (
  <div className="h-[32rem] w-[22rem]">
    <ActionButtonList {...args} />
  </div>
);

export const TypeExamples = Template.bind({});
TypeExamples.args = {
  actions: exampleTypeActions(),
};

export const TermExamples = Template.bind({});
TermExamples.args = {
  actions: exampleTermActions(),
};
