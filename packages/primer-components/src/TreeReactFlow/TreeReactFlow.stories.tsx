import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TreeReactFlow, TreeReactFlowProps } from "./TreeReactFlow";
import {
  tree1,
  tree2,
  tree3,
  tree4,
  tree5,
  oddEvenTrees,
  oddEvenTreesMiscStyles,
} from "@/examples/trees";

export default {
  title: "Application/Component Library/TreeReactFlow",
  component: TreeReactFlow,
} as ComponentMeta<typeof TreeReactFlow>;

const props = {
  nodeWidth: 150,
  nodeHeight: 50,
  boxPadding: 50,
};

const treeSized = (args: TreeReactFlowProps) => (
  <div className="h-[30rem] w-full">
    <TreeReactFlow {...args} />
  </div>
);

export const Tree1: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, trees: [tree1] });
export const Tree2: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, trees: [tree2] });
export const Tree3: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, trees: [tree3] });
export const Tree4: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, trees: [tree4] });
export const Tree5: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, trees: [tree5] });
export const AllTrees: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, trees: [tree1, tree2, tree3, tree4, tree5] });
export const OddAndEven: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, trees: oddEvenTrees });
export const OddAndEvenMiscStyles: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, trees: oddEvenTreesMiscStyles });
