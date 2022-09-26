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
import { Tree } from "@hackworthltd/primer-types";

export default {
  title: "Application/Component Library/TreeReactFlow",
  component: TreeReactFlow,
} as ComponentMeta<typeof TreeReactFlow>;

const props = {
  nodeWidth: 150,
  nodeHeight: 50,
  boxPadding: 50,
};

const emptyTypeTree = (n: string): Tree => {
  return {
    body: { tag: "NoBody" },
    childTrees: [],
    nodeId: "type ".concat(n),
    flavor: "FlavorTEmptyHole",
  };
};
const def1 = {
  name: { qualifiedModule: [], baseName: "Example 1" },
  term: tree1,
  type_: emptyTypeTree("1"),
};
const def2 = {
  name: { qualifiedModule: [], baseName: "Example 2" },
  term: tree2,
  type_: emptyTypeTree("2"),
};
const def3 = {
  name: { qualifiedModule: [], baseName: "Example 3" },
  term: tree3,
  type_: emptyTypeTree("3"),
};
const def4 = {
  name: { qualifiedModule: [], baseName: "Example 4" },
  term: tree4,
  type_: emptyTypeTree("4"),
};
const def5 = {
  name: { qualifiedModule: [], baseName: "Example 5" },
  term: tree5,
  type_: emptyTypeTree("5"),
};
const oddEvenDefs = oddEvenTrees.map((t, n) => {
  return {
    name: { qualifiedModule: [], baseName: "Odd or even " + n },
    term: t,
    type_: emptyTypeTree("oddEven".concat(n.toString())),
  };
});
const oddEvenDefsMiscStyles = oddEvenTreesMiscStyles.map((t, n) => {
  return {
    name: { qualifiedModule: [], baseName: "Odd or even misc " + n },
    term: t,
    type_: emptyTypeTree("oddEvenMiscStyles".concat(n.toString())),
  };
});

const treeSized = (args: TreeReactFlowProps) => (
  <div className="h-[30rem] w-full">
    <TreeReactFlow {...args} />
  </div>
);

export const Tree1: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, defs: [def1] });
export const Tree2: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, defs: [def2] });
export const Tree3: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, defs: [def3] });
export const Tree4: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, defs: [def4] });
export const Tree5: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, defs: [def5] });
export const AllTrees: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, defs: [def1, def2, def3, def4, def5] });
export const OddAndEven: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, defs: oddEvenDefs });
export const OddAndEvenMiscStyles: ComponentStory<typeof TreeReactFlow> = (
  _: TreeReactFlowProps
) => treeSized({ ...props, defs: oddEvenDefsMiscStyles });
