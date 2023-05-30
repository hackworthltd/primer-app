import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  defaultTreeReactFlowProps,
  TreeReactFlow,
  TreeReactFlowProps,
} from "./";
import {
  tree1,
  tree2,
  tree3,
  tree4,
  tree5,
  oddEvenTrees,
  oddEvenTreesMiscStyles,
} from "@/components/examples/trees";
import { Tree } from "@/primer-api";

export default {
  title: "Application/Component Library/TreeReactFlow",
  component: TreeReactFlow,
  argTypes: {
    onNodeClick: {
      description: "The event handler for a node click.",
      action: "node",
    },
  },
} as ComponentMeta<typeof TreeReactFlow>;

const props: Omit<TreeReactFlowProps, "defs"> = {
  ...defaultTreeReactFlowProps,
  scrollToDefRef: { current: undefined },
  forestLayout: "Vertical",
};

const emptyTypeTree = (nodeId: string): Tree => {
  return {
    body: { tag: "NoBody", contents: "TEmptyHole" },
    childTrees: [],
    nodeId,
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
const oddEvenDefs = oddEvenTrees.map(([baseName, term]) => {
  return {
    name: { qualifiedModule: [], baseName },
    term,
    type_: emptyTypeTree(baseName),
  };
});
const oddEvenDefsMiscStyles = oddEvenTreesMiscStyles.map(([baseName, term]) => {
  return {
    name: { qualifiedModule: [], baseName },
    term,
    type_: emptyTypeTree(baseName),
  };
});

const treeSized = (args: TreeReactFlowProps) => (
  <div className="h-[30rem] w-full">
    <TreeReactFlow {...{ ...props, ...args }} />
  </div>
);
export const Tree1: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: [def1],
    selection: { def: def1.name, node: { nodeType: "BodyNode", id: 100 } },
  });
export const Tree2: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: [def2],
  });
export const Tree3: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: [def3],
    selection: { def: def3.name, node: { nodeType: "BodyNode", id: 301 } },
  });
export const Tree4: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: [def4],
    selection: { def: def4.name, node: { nodeType: "BodyNode", id: 409 } },
  });
export const Tree5: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: [def5],
    selection: { def: def5.name, node: { nodeType: "BodyNode", id: 503 } },
  });
export const AllTrees: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: [def1, def2, def3, def4, def5],
    selection: { def: def3.name, node: { nodeType: "BodyNode", id: 301 } },
  });
export const OddAndEven: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: oddEvenDefs,
    selection: { def: def5.name, node: { nodeType: "BodyNode", id: 5 } },
  });
export const OddAndEvenMiscStyles: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: oddEvenDefsMiscStyles,
    selection: { def: def5.name, node: { nodeType: "BodyNode", id: 5 } },
  });
