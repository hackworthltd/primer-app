import { Action, InputAction, NoInputAction, Options } from "@/primer-api";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { ActionPanel } from "./";

export default {
  title: "Application/Component Library/ActionPanel",
  component: ActionPanel,
  argTypes: {
    actions: { control: "object", name: "List of actions" },
    onAction: { name: "onAction" },
    onInputAction: { name: "onInputAction" },
    onRequestOpts: {
      defaultValue: (_action: InputAction): Promise<Options> =>
        new Promise((resolve) =>
          resolve({
            opts: [
              { option: "option 0", context: ["a", "b", "c"] },
              { option: "option 1", context: ["a", "b", "c"] },
              { option: "option 2", context: ["a", "b", "c"] },
              { option: "option 3", context: ["a", "b", "c"] },
            ],
            free: true,
          })
        ),
    },
  },
} as ComponentMeta<typeof ActionPanel>;

const allNoInputActions: Action[] = Object.keys(NoInputAction).map(
  (action) => ({
    contents: action as NoInputAction,
    tag: "NoInput",
  })
);
const allInputActions: Action[] = Object.keys(InputAction).map((action) => ({
  contents: action as InputAction,
  tag: "Input",
}));
const allActions: Action[] = allInputActions.concat(allNoInputActions);

const exampleTypeActions: Action[] = [
  { tag: "NoInput", contents: "MakeFun" },
  { tag: "NoInput", contents: "MakeTApp" },
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

const Template: ComponentStory<typeof ActionPanel> = (args) => (
  <div className="h-[32rem] w-[22rem]">
    <ActionPanel {...args} />
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

// This isn't a realistic instantiation of the component, but it's useful to have all actions appear in some story.
export const AllActions = Template.bind({});
AllActions.args = {
  actions: allActions,
};
