import { ComponentStory, ComponentMeta } from "@storybook/react";

import { TreeVisx, TreeVisxI } from "./TreeVisx";
import { tree1, tree2, tree3, tree4, tree5 } from "@/examples/trees";

export default {
  title: "Application/Component Library/TreeVisx",
  component: TreeVisx,
  argTypes: {
    tree: { control: "object", name: "Tree to display" },
  },
} as ComponentMeta<typeof TreeVisx>;

const Template: ComponentStory<(args: TreeVisxI) => JSX.Element> = (args) => (
  <TreeVisx {...args} />
);

const size = { width: 400, height: 300 };

export const Tree1 = Template.bind({});
Tree1.args = { ...size, tree: tree1 };

export const Tree2 = Template.bind({});
Tree2.args = { ...size, tree: tree2 };

export const Tree3 = Template.bind({});
Tree3.args = { ...size, tree: tree3 };

export const Tree4 = Template.bind({});
Tree4.args = { ...size, tree: tree4 };

export const Tree5 = Template.bind({});
Tree5.args = { ...size, tree: tree5 };
