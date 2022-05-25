import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TreeReactFlow, TreeReactFlowProps } from "./TreeReactFlow";
import { tree1, tree2, tree3, tree4, tree5 } from "@/examples/trees";

export default {
  title: "Application/Component Library/TreeReactFlow",
  component: TreeReactFlow,
} as ComponentMeta<typeof TreeReactFlow>;

const props = { width: 1000, height: 800, nodeWidth: 100, nodeHeight: 40 };

export const Tree1: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...props} trees={[tree1]} />;
export const Tree2: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...props} trees={[tree2]} />;
export const Tree3: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...props} trees={[tree3]} />;
export const Tree4: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...props} trees={[tree4]} />;
export const Tree5: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...props} trees={[tree5]} />;
export const AllTrees: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...props} trees={[tree1, tree2, tree3, tree4, tree5]} />;
