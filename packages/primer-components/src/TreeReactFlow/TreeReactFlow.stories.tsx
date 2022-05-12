import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TreeReactFlow, TreeReactFlowProps } from "./TreeReactFlow";
import { tree1, tree2, tree3, tree4, tree5 } from "@/examples/trees";

export default {
  title: "Application/Component Library/TreeReactFlow",
  component: TreeReactFlow,
} as ComponentMeta<typeof TreeReactFlow>;

const size = { width: 1000, height: 300 };

export const Tree1: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...size} tree={tree1} />;
export const Tree2: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...size} tree={tree2} />;
export const Tree3: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...size} tree={tree3} />;
export const Tree4: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...size} tree={tree4} />;
export const Tree5: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => <TreeReactFlow {...size} tree={tree5} />;
