import { Action } from "@/primer-api";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ActionButtonList } from "./";

export default {
  title: "Application/Component Library/ActionButtonList",
  component: ActionButtonList,
  argTypes: {
    actions: { control: "object", name: "List of actions" },
  },
} as ComponentMeta<typeof ActionButtonList>;

const exampleTypeActions: Action[] = [
  { tag: "NoInput", contents: "MakeFun" },
  { tag: "NoInput", contents: "MakeApp" },
  { tag: "Input", contents: "MakeForall" },
  { tag: "NoInput", contents: "RaiseType" },
  { tag: "NoInput", contents: "DeleteType" },
];

const exampleTermActions: Action[] = [
  { tag: "Input", contents: "MakeLam" },
  { tag: "NoInput", contents: "MakeCase" },
  { tag: "NoInput", contents: "MakeApp" },
  { tag: "NoInput", contents: "MakeAPP" },
  { tag: "Input", contents: "MakeLAM" },
  { tag: "NoInput", contents: "MakeAnn" },
  { tag: "NoInput", contents: "Raise" },
  { tag: "NoInput", contents: "DeleteExpr" },
];

const Template: ComponentStory<typeof ActionButtonList> = (args) => (
  <div className="h-[32rem] w-[22rem]">
    <ActionButtonList {...args} />
  </div>
);

export const TypeExamples = Template.bind({});
TypeExamples.args = {
  actions: exampleTypeActions,
};

export const TermExamples = Template.bind({});
TermExamples.args = {
  actions: exampleTermActions,
};
