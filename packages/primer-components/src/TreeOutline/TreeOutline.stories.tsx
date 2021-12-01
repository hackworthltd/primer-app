import { ComponentStory, ComponentMeta } from "@storybook/react";

import { TreeInteractiveRender } from "@hackworthltd/primer-types";
import { TreeOutline } from "./TreeOutline";
import { tree1, tree2, tree3, tree4, tree5 } from "@/examples/trees";

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
  tree: TreeInteractiveRender;
}

const Template: ComponentStory<(args: TreeArgs) => JSX.Element> = (args) => (
  <TreeOutline {...args.tree} />
);

export const Tree1 = Template.bind({});
Tree1.args = { tree: tree1 };

export const Tree2 = Template.bind({});
Tree2.args = { tree: tree2 };

export const Tree3 = Template.bind({});
Tree3.args = { tree: tree3 };

export const Tree4 = Template.bind({});
Tree4.args = { tree: tree4 };

export const Tree5 = Template.bind({});
Tree5.args = { tree: tree5 };
