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
  tree6,
  oddEvenTrees,
  oddEvenTreesMiscStyles,
} from "@/components/examples/trees";
import { Tree, TypeDef } from "@/primer-api";

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

const props: Omit<TreeReactFlowProps, "defs" | "typeDefs" | "onNodeClick"> = {
  ...defaultTreeReactFlowProps,
  scrollToDefRef: { current: undefined },
  scrollToTypeDefRef: { current: undefined },
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
const def6 = {
  name: {
    qualifiedModule: [],
    baseName: "Example 6 is really annoying because of its long name",
  },
  term: tree6,
  type_: emptyTypeTree("6"),
};
const typeDef1: TypeDef = {
  name: { qualifiedModule: [], baseName: "Either-ish" },
  params: ["a", "b"],
  constructors: [
    {
      name: { qualifiedModule: [], baseName: "Left" },
      fields: [
        {
          nodeId: "1100",
          body: {
            tag: "TextBody",
            contents: {
              fst: "TVar",
              snd: { baseName: "a" },
            },
          },
          childTrees: [],
        },
      ],
    },
    {
      name: { qualifiedModule: [], baseName: "Right" },
      fields: [
        {
          nodeId: "1101",
          body: { tag: "NoBody", contents: "TApp" },
          childTrees: [
            {
              nodeId: "1102",
              body: { tag: "NoBody", contents: "TApp" },
              childTrees: [
                {
                  nodeId: "1103",
                  body: {
                    tag: "TextBody",
                    contents: {
                      fst: "TCon",
                      snd: { baseName: "Pair" },
                    },
                  },
                  childTrees: [],
                },
                {
                  nodeId: "1104",
                  body: {
                    tag: "TextBody",
                    contents: {
                      fst: "TCon",
                      snd: { baseName: "Bool" },
                    },
                  },
                  childTrees: [],
                },
              ],
            },
            {
              nodeId: "1105",
              body: {
                tag: "TextBody",
                contents: {
                  fst: "TVar",
                  snd: { baseName: "b" },
                },
              },
              childTrees: [],
            },
          ],
        },
        {
          nodeId: "1106",
          body: {
            tag: "TextBody",
            contents: { fst: "TCon", snd: { baseName: "Int" } },
          },
          childTrees: [],
        },
      ],
    },
  ],
  nameHints: ["x", "y"],
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
    typeDefs: [],
    selection: {
      tag: "SelectionDef",
      contents: { def: def1.name, node: { nodeType: "BodyNode", meta: 100 } },
    },
  });
export const Tree2: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: [def2],
    typeDefs: [],
  });
export const Tree3: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: [def3],
    typeDefs: [],
    selection: {
      tag: "SelectionDef",
      contents: { def: def3.name, node: { nodeType: "BodyNode", meta: 301 } },
    },
  });
export const Tree4: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: [def4],
    typeDefs: [],
    selection: {
      tag: "SelectionDef",
      contents: { def: def4.name, node: { nodeType: "BodyNode", meta: 409 } },
    },
  });
export const Tree5: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: [def5],
    typeDefs: [],
    selection: {
      tag: "SelectionDef",
      contents: { def: def5.name, node: { nodeType: "BodyNode", meta: 503 } },
    },
  });
export const Tree6: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: [def6],
    typeDefs: [],
    selection: {
      tag: "SelectionDef",
      contents: { def: def6.name, node: { nodeType: "BodyNode", meta: 503 } },
    },
  });
export const TreeType1: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: [],
    typeDefs: [typeDef1],
    selection: {
      tag: "SelectionTypeDef",
      contents: {
        def: typeDef1.name,
        node: { tag: "TypeDefParamNodeSelection", contents: "a" },
      },
    },
  });
export const AllTrees: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: [def1, def2, def3, def4, def5, def6],
    typeDefs: [typeDef1],
    selection: {
      tag: "SelectionDef",
      contents: { def: def3.name, node: { nodeType: "BodyNode", meta: 301 } },
    },
  });
export const OddAndEven: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: oddEvenDefs,
    typeDefs: [],
    selection: {
      tag: "SelectionDef",
      contents: { def: def5.name, node: { nodeType: "BodyNode", meta: 5 } },
    },
  });
export const OddAndEvenMiscStyles: ComponentStory<typeof TreeReactFlow> = (
  args: TreeReactFlowProps
) =>
  treeSized({
    ...args,
    defs: oddEvenDefsMiscStyles,
    typeDefs: [],
    selection: {
      tag: "SelectionDef",
      contents: { def: def5.name, node: { nodeType: "BodyNode", meta: 5 } },
    },
  });
