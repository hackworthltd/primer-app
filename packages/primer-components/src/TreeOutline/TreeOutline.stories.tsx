import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Tree } from "@hackworthltd/primer-types";
import { TreeOutline } from "./TreeOutline";

export default {
  title: "Application/Component Library/TreeOutline",
  component: TreeOutline,
  argTypes: {
    tree: { control: "object", name: "Tree to display" },
  },
} as ComponentMeta<typeof TreeOutline>;

/* We have this indirection so storybook renders the whole json description of
 * a tree as one control. (As having three separate controls for 'label', 'id'
 * and 'subtrees' is not particularly useful.)
 */
interface TreeArgs {
  tree: Tree;
}

const Template: ComponentStory<(args: TreeArgs) => JSX.Element> = (args) => (
  <TreeOutline {...args.tree} />
);

export const Tree1 = Template.bind({});
Tree1.args = { tree: { nodeId: 0, childTrees: [], label: "EmptyHole" } };

export const Tree2 = Template.bind({});
Tree2.args = {
  tree: {
    nodeId: 0,
    childTrees: [{ nodeId: 1, childTrees: [], label: "Var x" }],
    label: "Lam x",
  },
};

export const Tree3 = Template.bind({});
Tree3.args = {
  tree: {
    nodeId: 0,
    childTrees: [{ nodeId: 1, childTrees: [], label: "Var y" }],
    label: "Lam y",
  },
};

export const Tree4 = Template.bind({});
Tree4.args = {
  tree: {
    nodeId: 0,
    childTrees: [
      {
        nodeId: 1,
        childTrees: [
          {
            nodeId: 2,
            childTrees: [
              {
                nodeId: 3,
                childTrees: [{ nodeId: 4, childTrees: [], label: "Var x" }],
                label: "Lam x",
              },
            ],
            label: "LAM a",
          },
          {
            nodeId: 5,
            childTrees: [
              {
                nodeId: 6,
                childTrees: [
                  { nodeId: 7, childTrees: [], label: "TVar a" },
                  { nodeId: 8, childTrees: [], label: "TVar a" },
                ],
                label: "TFun",
              },
            ],
            label: "TForall",
          },
        ],
        label: "Ann",
      },
      { nodeId: 9, childTrees: [], label: "Con Unit" },
    ],
    label: "App",
  },
};

export const Tree5 = Template.bind({});
Tree5.args = {
  tree: {
    nodeId: 0,
    childTrees: [
      {
        nodeId: 1,
        childTrees: [
          { nodeId: 2, childTrees: [], label: "Var x" },
          { nodeId: 3, childTrees: [], label: "EmptyHole" },
          { nodeId: 6, childTrees: [], label: "EmptyHole" },
        ],
        label: "Case",
      },
    ],
    label: "Lam x",
  },
};
